import { NextResponse } from 'next/server'

/** Read-only check: are support email env vars present? (no secrets exposed) */
export async function GET() {
  const key = process.env.RESEND_API_KEY?.trim()
  const to = process.env.NOTIFY_TO_EMAIL?.trim()
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    'CareConnect <onboarding@resend.dev>'

  return NextResponse.json({
    resendKeyConfigured: Boolean(key),
    notifyToConfigured: Boolean(to),
    fromAddress: from,
    hint:
      'With onboarding@resend.dev, Resend usually only delivers to your Resend signup email until you verify a domain. Set NOTIFY_TO_EMAIL to that address, or verify careconnect-24-7.com in Resend.',
  })
}
