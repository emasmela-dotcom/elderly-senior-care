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
      { error: 'No billing account found. Start a plan first.' },
      { status: 400 }
    )
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: `${getBaseUrl()}/pricing`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Could not open billing portal'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
