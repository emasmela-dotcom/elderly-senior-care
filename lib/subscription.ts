import { getSql } from '@/lib/db'
import { getStripe, stripeConfigured } from '@/lib/stripe'

export type SubscriptionRow = {
  user_email: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: string
  plan_interval: string | null
  trial_end: string | null
  current_period_end: string | null
  updated_at: string
}

export type SubscriptionStatus = {
  active: boolean
  status: string
  planInterval: string | null
  trialEnd: string | null
  currentPeriodEnd: string | null
  needsPayment: boolean
  paymentPrompt: string | null
  confirmationMessage: string | null
  hasPaymentMethod: boolean
  paymentReceived: boolean
  trialDaysLeft: number | null
}

const ACTIVE_STATUSES = new Set(['active', 'trialing', 'paused'])

const PAYMENT_PROMPT_DAYS = 3

function emptyStatus(overrides: Partial<SubscriptionStatus> = {}): SubscriptionStatus {
  return {
    active: false,
    status: 'none',
    planInterval: null,
    trialEnd: null,
    currentPeriodEnd: null,
    needsPayment: false,
    paymentPrompt: null,
    confirmationMessage: null,
    hasPaymentMethod: false,
    paymentReceived: false,
    trialDaysLeft: null,
    ...overrides,
  }
}

function daysUntil(isoDate: string | null): number | null {
  if (!isoDate) return null
  const end = new Date(isoDate)
  if (Number.isNaN(end.getTime())) return null
  const ms = end.getTime() - Date.now()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export function buildPaymentPrompt(
  status: string,
  trialEnd: string | null,
  hasPaymentMethod = false
): Pick<
  SubscriptionStatus,
  'needsPayment' | 'paymentPrompt' | 'confirmationMessage' | 'trialDaysLeft' | 'paymentReceived'
> {
  const trialDaysLeft = daysUntil(trialEnd)

  if (status === 'active') {
    return {
      needsPayment: false,
      paymentPrompt: null,
      confirmationMessage: 'Payment received. Your CareConnect plan is active.',
      trialDaysLeft,
      paymentReceived: true,
    }
  }

  if (status === 'trialing' && hasPaymentMethod) {
    return {
      needsPayment: false,
      paymentPrompt: null,
      confirmationMessage:
        'Card saved. Your plan will continue automatically when the free trial ends.',
      trialDaysLeft,
      paymentReceived: false,
    }
  }

  if (status === 'paused' && hasPaymentMethod) {
    return {
      needsPayment: false,
      paymentPrompt: null,
      confirmationMessage: 'Payment method saved. Your account is being reactivated.',
      trialDaysLeft: 0,
      paymentReceived: false,
    }
  }

  if (status === 'paused') {
    return {
      needsPayment: true,
      paymentPrompt:
        'Your free trial has ended. Add a payment method to keep using CareConnect.',
      trialDaysLeft: 0,
      paymentReceived: false,
    }
  }

  if (status === 'trialing' && trialDaysLeft !== null) {
    if (trialDaysLeft <= 0) {
      return {
        needsPayment: true,
        paymentPrompt:
          'Your free trial has ended. Add a payment method to keep your account active.',
        confirmationMessage: null,
        trialDaysLeft: 0,
        paymentReceived: false,
      }
    }
    if (trialDaysLeft <= PAYMENT_PROMPT_DAYS) {
      return {
        needsPayment: true,
        paymentPrompt: `Your free trial ends in ${trialDaysLeft} day${
          trialDaysLeft === 1 ? '' : 's'
        }. Add a payment method to continue after the trial.`,
        confirmationMessage: null,
        trialDaysLeft,
        paymentReceived: false,
      }
    }
  }

  return {
    needsPayment: false,
    paymentPrompt: null,
    confirmationMessage: null,
    trialDaysLeft,
    paymentReceived: false,
  }
}

export function isActiveStatus(status: string | null | undefined): boolean {
  return Boolean(status && ACTIVE_STATUSES.has(status))
}

export async function getSubscription(
  userEmail: string
): Promise<SubscriptionRow | null> {
  const sql = getSql()
  const rows = await sql`
    SELECT user_email, stripe_customer_id, stripe_subscription_id, status,
           plan_interval, trial_end, current_period_end, updated_at
    FROM subscriptions
    WHERE user_email = ${userEmail}
    LIMIT 1
  `
  return (rows[0] as SubscriptionRow | undefined) ?? null
}

export async function customerHasPaymentMethod(customerId: string): Promise<boolean> {
  if (!stripeConfigured()) return false
  try {
    const customer = await getStripe().customers.retrieve(customerId)
    if (customer.deleted) return false
    if (customer.invoice_settings?.default_payment_method) return true
    const methods = await getStripe().paymentMethods.list({
      customer: customerId,
      type: 'card',
      limit: 1,
    })
    return methods.data.length > 0
  } catch {
    return false
  }
}

export async function getSubscriptionStatus(
  userEmail: string
): Promise<SubscriptionStatus> {
  try {
    const row = await getSubscription(userEmail)
    if (!row) {
      return emptyStatus()
    }
    const hasPaymentMethod = row.stripe_customer_id
      ? await customerHasPaymentMethod(row.stripe_customer_id)
      : false
    const prompt = buildPaymentPrompt(row.status, row.trial_end, hasPaymentMethod)
    return {
      active: isActiveStatus(row.status),
      status: row.status,
      planInterval: row.plan_interval,
      trialEnd: row.trial_end,
      currentPeriodEnd: row.current_period_end,
      hasPaymentMethod,
      ...prompt,
    }
  } catch {
    return emptyStatus({ status: 'unknown' })
  }
}

type UpsertInput = {
  userEmail: string
  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null
  status: string
  planInterval?: string | null
  trialEnd?: Date | null
  currentPeriodEnd?: Date | null
}

export async function upsertSubscription(input: UpsertInput): Promise<void> {
  const sql = getSql()
  await sql`
    INSERT INTO subscriptions (
      user_email,
      stripe_customer_id,
      stripe_subscription_id,
      status,
      plan_interval,
      trial_end,
      current_period_end,
      updated_at
    ) VALUES (
      ${input.userEmail},
      ${input.stripeCustomerId ?? null},
      ${input.stripeSubscriptionId ?? null},
      ${input.status},
      ${input.planInterval ?? null},
      ${input.trialEnd ?? null},
      ${input.currentPeriodEnd ?? null},
      now()
    )
    ON CONFLICT (user_email) DO UPDATE SET
      stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, subscriptions.stripe_customer_id),
      stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, subscriptions.stripe_subscription_id),
      status = EXCLUDED.status,
      plan_interval = COALESCE(EXCLUDED.plan_interval, subscriptions.plan_interval),
      trial_end = EXCLUDED.trial_end,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = now()
  `
}
