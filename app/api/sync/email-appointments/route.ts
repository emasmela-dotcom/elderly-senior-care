import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'

/**
 * PHASE 2 — Gmail / Outlook Appointment Email Parsing
 *
 * Gmail:
 *   - Additional OAuth scope needed (add to connect route):
 *       https://www.googleapis.com/auth/gmail.readonly
 *   - Search query to find appointment emails:
 *       "subject:(appointment OR reminder OR visit OR referral) newer_than:60d"
 *   - API: GET https://gmail.googleapis.com/gmail/v1/users/me/messages?q=...
 *   - Then GET .../messages/{id}?format=full to get body
 *   - Decode base64url payload.body.data or payload.parts
 *   - Extract date/time/doctor/location using Claude claude-haiku-4-5 for low cost:
 *       POST /v1/messages with the email body, ask for JSON {date, time, doctor, location}
 *   - Surface as "suggested" appointments requiring user confirmation before insert
 *
 * Outlook / Microsoft 365:
 *   - Register app at https://portal.azure.com → App registrations
 *   - OAuth via https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
 *   - Scope: Mail.Read (delegated)
 *   - Graph API: GET https://graph.microsoft.com/v1.0/me/messages?$filter=...
 *   - TODO: Add MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_TENANT_ID to .env
 *
 * Safe fallback: never auto-insert parsed emails. Always stage for user review.
 * Add a `sync_status TEXT DEFAULT 'confirmed'` column to appointments in Phase 2
 * so staged rows can be shown in a "Review suggested appointments" UI.
 */
export async function POST() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  return NextResponse.json(
    { error: 'Email appointment parsing is not yet available. Coming soon.' },
    { status: 501 }
  )
}
