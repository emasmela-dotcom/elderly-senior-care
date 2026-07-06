import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { getStripe, getBaseUrl, stripeConfigured } from '@/lib/stripe'
import { getSubscription } from '@/lib/subscription'

export async function POST() {
  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: 'Billing is not configured yet.' },
      { status: 503 }
    )
  }

  const auth = await requireSession()
  if (auth.ok === false) return auth.response

  const email = auth.session.user?.email?.trim()
  if (!email) {
    return NextResponse.json({ error: 'Sign in first.' }, { status: 400 })
  }

  const row = await getSubscription(email)
  if (!row?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'Start your free trial first.' },
      { status: 400 }
    )
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: 'setup',
      customer: row.stripe_customer_id,
      payment_method_types: ['card'],
      success_url: `${getBaseUrl()}/pricing?payment=added`,
      cancel_url: `${getBaseUrl()}/pricing?payment=canceled`,
      metadata: { user_email: email },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Could not open payment form.' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment setup failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
