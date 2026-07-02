import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { googleRedirectUri } from '@/lib/sync/googleOAuth'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const clientId = process.env.EPIC_CLIENT_ID?.trim()
  const fhirBase = process.env.EPIC_FHIR_BASE_URL?.trim()
  if (!clientId || !fhirBase) {
    return NextResponse.json(
      {
        error:
          'MyChart is not configured yet. Set EPIC_CLIENT_ID and EPIC_FHIR_BASE_URL in your server environment.',
      },
      { status: 503 }
    )
  }

  const redirectUri = googleRedirectUri('/api/sync/epic/callback')
  const state = Buffer.from(
    JSON.stringify({ email: auth.session.user?.email ?? '', ts: Date.now() })
  ).toString('base64url')

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'patient/MedicationRequest.read patient/Appointment.read launch/patient openid fhirUser',
    aud: fhirBase,
    state,
  })

  const authorize = `${fhirBase.replace(/\/$/, '')}/oauth2/authorize?${params.toString()}`
  return NextResponse.redirect(authorize)
}
