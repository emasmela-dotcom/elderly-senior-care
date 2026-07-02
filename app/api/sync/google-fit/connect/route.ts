import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { googleRedirectUri } from '@/lib/sync/googleOAuth'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

const FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.blood_pressure.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.blood_glucose.read',
].join(' ')

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID is not configured.' }, { status: 500 })
  }

  const redirectUri = googleRedirectUri('/api/sync/google-fit/callback')
  const state = Buffer.from(
    JSON.stringify({ email: auth.session.user?.email ?? '', ts: Date.now() })
  ).toString('base64url')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: FIT_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    state,
  })

  return NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`)
}
