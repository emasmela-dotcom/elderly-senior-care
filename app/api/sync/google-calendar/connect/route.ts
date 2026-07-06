import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

export async function GET() {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID is not configured.' },
      { status: 500 }
    )
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const redirectUri = `${baseUrl}/api/sync/google-calendar/callback`

  const state = Buffer.from(
    JSON.stringify({ email: auth.session.user?.email ?? '', ts: Date.now() })
  ).toString('base64url')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    access_type: 'offline',
    prompt: 'consent',
    state,
  })

  return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`)
}
