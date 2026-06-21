import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'

export async function GET(req: Request) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const state = searchParams.get('state')

  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const appointmentsUrl = `${baseUrl}/appointments`

  if (error || !code) {
    return NextResponse.redirect(`${appointmentsUrl}?sync=error`)
  }

  if (state) {
    try {
      const parsed = JSON.parse(
        Buffer.from(state, 'base64url').toString('utf-8')
      ) as { email?: string; ts?: number }
      const age = Date.now() - (parsed.ts ?? 0)
      if (age > 10 * 60 * 1000) {
        return NextResponse.redirect(`${appointmentsUrl}?sync=error`)
      }
      const sessionEmail = auth.session.user?.email ?? ''
      if (parsed.email && sessionEmail && parsed.email !== sessionEmail) {
        return NextResponse.redirect(`${appointmentsUrl}?sync=error`)
      }
    } catch {
      return NextResponse.redirect(`${appointmentsUrl}?sync=error`)
    }
  }

  const clientId = process.env.GOOGLE_CLIENT_ID ?? ''
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? ''
  const redirectUri = `${baseUrl}/api/sync/google-calendar/callback`

  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = (await tokenRes.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
      error?: string
    }

    if (!tokenRes.ok || !tokens.access_token) {
      console.error('[gcal callback] token exchange failed', tokens.error)
      return NextResponse.redirect(`${appointmentsUrl}?sync=error`)
    }

    const isProd = process.env.NODE_ENV === 'production'

    const response = NextResponse.redirect(`${appointmentsUrl}?sync=importing`)

    response.cookies.set('gcal_access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: tokens.expires_in ?? 3600,
      path: '/',
    })

    if (tokens.refresh_token) {
      response.cookies.set('gcal_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 60,
        path: '/',
      })
    }

    return response
  } catch (err) {
    console.error('[gcal callback] unexpected error', err)
    return NextResponse.redirect(`${appointmentsUrl}?sync=error`)
  }
}
