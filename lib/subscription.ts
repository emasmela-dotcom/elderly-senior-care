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
}

const ACTIVE_STATUSES = new Set(['active', 'trialing'])

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
      return {
        active: false,
        status: 'none',
        planInterval: null,
        trialEnd: null,
        currentPeriodEnd: null,
      }
    }
    return {
      active: isActiveStatus(row.status),
      status: row.status,
      planInterval: row.plan_interval,
      trialEnd: row.trial_end,
      currentPeriodEnd: row.current_period_end,
    }
  } catch {
    return {
      active: false,
      status: 'unknown',
      planInterval: null,
      trialEnd: null,
      currentPeriodEnd: null,
    }
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
