import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import type Stripe from 'stripe'
import { getStripe, stripeConfigured } from '@/lib/stripe'
import { upsertSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

function periodEnd(sub: Stripe.Subscription): Date | null {
  const end = sub.items.data[0]?.current_period_end
  return end ? new Date(end * 1000) : null
}

function planInterval(sub: Stripe.Subscription): string | null {
  const interval = sub.items.data[0]?.price?.recurring?.interval
  return interval ?? null
}

function userEmailFromMeta(
  metadata: Stripe.Metadata | null | undefined
): string | null {
  const email = metadata?.user_email?.trim()
  return email || null
}

async function syncSubscription(sub: Stripe.Subscription, fallbackEmail?: string) {
  const email =
    userEmailFromMeta(sub.metadata) ??
    fallbackEmail ??
    null
  if (!email) return

  const customerId =
    typeof sub.customer === 'string' ? sub.customer : sub.customer?.id ?? null

  await upsertSubscription({
    userEmail: email,
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    status: sub.status,
    planInterval: planInterval(sub),
    trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
    currentPeriodEnd: periodEnd(sub),
  })
}

export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim()
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not set' }, { status: 503 })
  }

  const body = await req.text()
  const signature = headers().get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const email = userEmailFromMeta(session.metadata)
        if (session.subscription && typeof session.subscription === 'string') {
          const sub = await getStripe().subscriptions.retrieve(session.subscription)
          await syncSubscription(sub, email ?? undefined)
        } else if (email && session.customer && typeof session.customer === 'string') {
          await upsertSubscription({
            userEmail: email,
            stripeCustomerId: session.customer,
            status: 'trialing',
          })
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await syncSubscription(sub)
        break
      }
      default:
        break
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook handler failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
