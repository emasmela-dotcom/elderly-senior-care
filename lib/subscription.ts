import { getSql } from '@/lib/db'

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
  trialEnd: string | null
): Pick<SubscriptionStatus, 'needsPayment' | 'paymentPrompt' | 'trialDaysLeft'> {
  const trialDaysLeft = daysUntil(trialEnd)

  if (status === 'paused') {
    return {
      needsPayment: true,
      paymentPrompt:
        'Your free trial has ended. Add a payment method to keep using CareConnect.',
      trialDaysLeft: 0,
    }
  }

  if (status === 'trialing' && trialDaysLeft !== null) {
    if (trialDaysLeft <= 0) {
      return {
        needsPayment: true,
        paymentPrompt:
          'Your free trial has ended. Add a payment method to keep your account active.',
        trialDaysLeft: 0,
      }
    }
    if (trialDaysLeft <= PAYMENT_PROMPT_DAYS) {
      return {
        needsPayment: true,
        paymentPrompt: `Your free trial ends in ${trialDaysLeft} day${
          trialDaysLeft === 1 ? '' : 's'
        }. Add a payment method to continue after the trial.`,
        trialDaysLeft,
      }
    }
  }

  return {
    needsPayment: false,
    paymentPrompt: null,
    trialDaysLeft,
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

export async function getSubscriptionStatus(
  userEmail: string
): Promise<SubscriptionStatus> {
  try {
    const row = await getSubscription(userEmail)
    if (!row) {
      return emptyStatus()
    }
    const prompt = buildPaymentPrompt(row.status, row.trial_end)
    return {
      active: isActiveStatus(row.status),
      status: row.status,
      planInterval: row.plan_interval,
      trialEnd: row.trial_end,
      currentPeriodEnd: row.current_period_end,
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
