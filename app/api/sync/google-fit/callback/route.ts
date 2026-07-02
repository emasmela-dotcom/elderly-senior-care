import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { googleRedirectUri } from '@/lib/sync/googleOAuth'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'

export async function GET(req: Request) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const vitalsBase = `${base}/vitals`

  if (error || !code) {
    return NextResponse.redirect(`${vitalsBase}?gfit=error`)
  }

  const redirectUri = googleRedirectUri('/api/sync/google-fit/callback')

  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = (await tokenRes.json()) as {
      access_token?: string
      refresh_token?: string
      expires_in?: number
    }

    if (!tokenRes.ok || !tokens.access_token) {
      return NextResponse.redirect(`${vitalsBase}?gfit=error`)
    }

    const isProd = process.env.NODE_ENV === 'production'
    const response = NextResponse.redirect(`${vitalsBase}?gfit=importing`)

    response.cookies.set('gfit_access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: tokens.expires_in ?? 3600,
      path: '/',
    })

    if (tokens.refresh_token) {
      response.cookies.set('gfit_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 60,
        path: '/',
      })
    }

    return response
  } catch {
    return NextResponse.redirect(`${vitalsBase}?gfit=error`)
  }
}
