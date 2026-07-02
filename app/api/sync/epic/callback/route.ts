import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { googleRedirectUri } from '@/lib/sync/googleOAuth'

export async function GET(req: Request) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  const healthUrl = `${base}/health-records`

  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code || searchParams.get('error')) {
    return NextResponse.redirect(`${healthUrl}?epic=error`)
  }

  const fhirBase = process.env.EPIC_FHIR_BASE_URL?.trim()?.replace(/\/$/, '')
  const clientId = process.env.EPIC_CLIENT_ID?.trim()
  const redirectUri = googleRedirectUri('/api/sync/epic/callback')

  if (!fhirBase || !clientId) {
    return NextResponse.redirect(`${healthUrl}?epic=error`)
  }

  try {
    const tokenRes = await fetch(`${fhirBase}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
      }),
    })

    const tokens = (await tokenRes.json()) as {
      access_token?: string
      patient?: string
      expires_in?: number
    }

    if (!tokenRes.ok || !tokens.access_token) {
      return NextResponse.redirect(`${healthUrl}?epic=error`)
    }

    const isProd = process.env.NODE_ENV === 'production'
    const response = NextResponse.redirect(`${healthUrl}?epic=importing`)

    response.cookies.set('epic_access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: tokens.expires_in ?? 3600,
      path: '/',
    })
    if (tokens.patient) {
      response.cookies.set('epic_patient_id', tokens.patient, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: tokens.expires_in ?? 3600,
        path: '/',
      })
    }

    return response
  } catch {
    return NextResponse.redirect(`${healthUrl}?epic=error`)
  }
}
