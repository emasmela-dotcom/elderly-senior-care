import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { requireSession, familyReadOnlyGuard } from '@/lib/requireAuth'

const GCAL_EVENTS_URL =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events'
const REFRESH_URL = 'https://oauth2.googleapis.com/token'

interface GCalEvent {
  id: string
  summary?: string
  description?: string
  location?: string
  organizer?: { displayName?: string; email?: string }
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
  status?: string
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })
    const data = (await res.json()) as { access_token?: string }
    return data.access_token ?? null
  } catch {
    return null
  }
}

function parseEvent(event: GCalEvent): {
  type: string
  doctor_name: string
  appt_date: string
  appt_time: string | null
  location: string | null
  notes: string
} | null {
  const startRaw = event.start?.dateTime ?? event.start?.date
  if (!startRaw) return null
  if (event.status === 'cancelled') return null

  const isAllDay = !event.start?.dateTime
  const startDate = new Date(startRaw)

  const appt_date = isAllDay
    ? startRaw.slice(0, 10)
    : startDate.toISOString().slice(0, 10)

  const appt_time = isAllDay
    ? null
    : startDate.toTimeString().slice(0, 5)

  const doctor_name =
    event.organizer?.displayName ??
    event.organizer?.email ??
    'Calendar'

  const baseNotes = event.description
    ? event.description.slice(0, 800)
    : ''
  const notes = baseNotes
    ? `${baseNotes}\n[gcal:${event.id}]`
    : `[gcal:${event.id}]`

  return {
    type: event.summary?.slice(0, 200) ?? 'Calendar Event',
    doctor_name: doctor_name.slice(0, 200),
    appt_date,
    appt_time,
    location: event.location?.slice(0, 300) ?? null,
    notes,
  }
}

export async function POST() {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response

  const guard = familyReadOnlyGuard(auth.session, 'POST')
  if (guard) return guard

  const cookieStore = await cookies()
  let accessToken = cookieStore.get('gcal_access_token')?.value
  const refreshToken = cookieStore.get('gcal_refresh_token')?.value

  if (!accessToken && refreshToken) {
    accessToken = (await refreshAccessToken(refreshToken)) ?? undefined
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not connected to Google Calendar. Please connect first.' },
      { status: 401 }
    )
  }

  try {
    const timeMin = new Date().toISOString()
    const timeMax = new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000
    ).toISOString()

    const url = new URL(GCAL_EVENTS_URL)
    url.searchParams.set('timeMin', timeMin)
    url.searchParams.set('timeMax', timeMax)
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')
    url.searchParams.set('maxResults', '100')

    const gcalRes = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (gcalRes.status === 401) {
      return NextResponse.json(
        { error: 'Google Calendar session expired. Please reconnect.' },
        { status: 401 }
      )
    }

    if (!gcalRes.ok) {
      const err = await gcalRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: 'Google Calendar fetch failed.', detail: err },
        { status: 502 }
      )
    }

    const gcalData = (await gcalRes.json()) as { items?: GCalEvent[] }
    const events = gcalData.items ?? []

    const sql = getSql()
    let imported = 0
    let skipped = 0

    for (const event of events) {
      const parsed = parseEvent(event)
      if (!parsed) {
        skipped++
        continue
      }

      const dedupePattern = `%[gcal:${event.id}]%`
      const existing = await sql`
        SELECT id FROM appointments
        WHERE notes LIKE ${dedupePattern}
        LIMIT 1
      `
      if ((existing as unknown[]).length > 0) {
        skipped++
        continue
      }

      await sql`
        INSERT INTO appointments
          (resident_id, resident_name, type, doctor_name,
           appt_date, appt_time, location, notes, checklist_json)
        VALUES
          (NULL, '', ${parsed.type}, ${parsed.doctor_name},
           ${parsed.appt_date}, ${parsed.appt_time},
           ${parsed.location}, ${parsed.notes}, '[]')
      `
      imported++
    }

    return NextResponse.json({ imported, skipped, total: events.length })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
