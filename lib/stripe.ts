import Stripe from 'stripe'

let client: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  if (!client) {
    client = new Stripe(key)
  }
  return client
}

export function stripeConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
      process.env.STRIPE_PRICE_MONTHLY?.trim() &&
      process.env.STRIPE_PRICE_YEARLY?.trim()
  )
}

export function getBaseUrl(): string {
  const fromEnv = process.env.NEXTAUTH_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return 'http://localhost:3000'
}

export const TRIAL_DAYS = 7

export const PLANS = {
  monthly: {
    id: 'monthly' as const,
    label: 'Monthly',
    price: 9,
    interval: 'month' as const,
    envKey: 'STRIPE_PRICE_MONTHLY',
  },
  yearly: {
    id: 'yearly' as const,
    label: 'Yearly',
    price: 79,
    interval: 'year' as const,
    envKey: 'STRIPE_PRICE_YEARLY',
  },
}

export type PlanId = keyof typeof PLANS

export function getPriceId(plan: PlanId): string {
  const id =
    plan === 'monthly'
      ? process.env.STRIPE_PRICE_MONTHLY?.trim()
      : process.env.STRIPE_PRICE_YEARLY?.trim()
  if (!id) {
    throw new Error(`Stripe price for ${plan} is not configured`)
  }
  return id
}
