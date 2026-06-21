import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'

/**
 * PHASE 2 — Apple Calendar (iCloud CalDAV)
 *
 * Apple has no public OAuth REST calendar API.
 * Two implementation paths for Phase 2:
 *
 * Option A — .ics file upload (simplest, no OAuth):
 *   - User exports calendar from Calendar.app or icloud.com as .ics
 *   - POST the file here, parse with the `ical.js` npm package
 *   - Map VEVENT components → appointments table (same fields as gcal import)
 *
 * Option B — CalDAV (RFC 4791) with app-specific password:
 *   - User generates an Apple app-specific password at appleid.apple.com
 *   - Connect to caldav.icloud.com with Basic auth (email + app password)
 *   - Use `tsdav` npm package: createDAVClient({ serverUrl, credentials })
 *   - fetchCalendarObjects() → parse ICS strings → map to appointments
 *
 * Recommended: ship Option A first (zero OAuth friction for the user).
 *
 * TODO Phase 2:
 *   - Accept multipart/form-data with .ics file
 *   - Parse VEVENT: DTSTART, DTEND, SUMMARY → type, LOCATION, DESCRIPTION
 *   - Dedupe by UID field (same pattern as gcal: embed in notes as [apple:UID])
 *   - Insert into appointments via getSql() using same pattern as gcal import
 */
export async function POST() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  return NextResponse.json(
    { error: 'Apple Calendar sync is not yet available. Coming soon.' },
    { status: 501 }
  )
}
