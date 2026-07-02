import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { parseIcsEvents } from '@/lib/sync/parseIcs'
import { importAppointmentRows } from '@/lib/sync/importAppointments'

const MAX_BYTES = 5 * 1024 * 1024

export async function POST(req: Request) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const guard = familyReadOnlyGuard(auth.session, 'POST')
  if (guard) return guard

  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Upload a calendar .ics file.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File is too large (max 5MB).' }, { status: 400 })
    }

    const text = await file.text()
    const events = parseIcsEvents(text, { sourceTag: 'apple' })
    if (events.length === 0) {
      return NextResponse.json(
        { error: 'No upcoming appointments found in that file.' },
        { status: 400 }
      )
    }

    const sql = getSql()
    const result = await importAppointmentRows(
      sql,
      events.map((e) => ({
        dedupeTag: `[apple:${e.uid}]`,
        type: e.type,
        doctor_name: e.doctor_name,
        appt_date: e.appt_date,
        appt_time: e.appt_time,
        location: e.location,
        notes: e.notes,
      }))
    )

    return NextResponse.json(result)
  } catch (e) {
    return dbErrorResponse(e)
  }
}
