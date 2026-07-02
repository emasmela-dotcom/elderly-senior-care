import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { getSubscriptionStatus } from '@/lib/subscription'
import { stripeConfigured } from '@/lib/stripe'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const email = auth.session.user?.email?.trim()
  if (!email) {
    return NextResponse.json({ error: 'Sign in first.' }, { status: 400 })
  }

  const status = await getSubscriptionStatus(email)
  return NextResponse.json({
    configured: stripeConfigured(),
    ...status,
  })
}
