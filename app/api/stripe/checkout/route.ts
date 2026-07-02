import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { getStripe, getBaseUrl, getPriceId, TRIAL_DAYS, stripeConfigured, type PlanId } from '@/lib/stripe'
import { getSubscription } from '@/lib/subscription'

export async function POST(req: Request) {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: 'Billing is not configured yet. Please try again later.' },
      { status: 503 }
    )
  }

  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const email = auth.session.user?.email?.trim()
  if (!email) {
    return NextResponse.json({ error: 'Sign in with an email address first.' }, { status: 400 })
  }

  let plan: PlanId = 'monthly'
  try {
    const body = (await req.json()) as { plan?: string }
    if (body.plan === 'yearly' || body.plan === 'monthly') {
      plan = body.plan
    }
  } catch {
    // default monthly
  }

  try {
    const stripe = getStripe()
    const existing = await getSubscription(email)
    let customerId = existing?.stripe_customer_id ?? null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { user_email: email },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: getPriceId(plan), quantity: 1 }],
      payment_method_collection: 'if_required',
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'pause',
          },
        },
        metadata: { user_email: email },
      },
      success_url: `${getBaseUrl()}/pricing?success=1`,
      cancel_url: `${getBaseUrl()}/pricing?canceled=1`,
      metadata: { user_email: email, plan },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
