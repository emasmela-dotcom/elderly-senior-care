import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { sendCareNotification } from '@/lib/notify'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'GET')
  if (g) return g
  try {
    const sql = getSql()
    const rows =
      await sql`SELECT * FROM appointments ORDER BY appt_date DESC, appt_time DESC`
    const mapped = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id,
      residentId: (r.resident_id as string) || '',
      residentName: (r.resident_name as string) || '',
      type: (r.type as string) || '',
      doctorName: (r.doctor_name as string) || '',
      date: r.appt_date,
      time: (r.appt_time as string) || '',
      location: (r.location as string) || undefined,
      address: (r.address as string) || undefined,
      notes: (r.notes as string) || undefined,
      checklist: safeChecklist(r.checklist_json),
    }))
    return NextResponse.json(mapped)
  } catch (e) {
    return dbErrorResponse(e)
  }
}

function safeChecklist(v: unknown): { id: string; text: string; completed: boolean }[] {
  if (typeof v !== 'string') return []
  try {
    const p = JSON.parse(v)
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

export async function POST(req: Request) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'POST')
  if (g) return g
  try {
    const body = await req.json()
    const resident_id = body.resident_id
      ? String(body.resident_id).trim()
      : null
    const resident_name = body.resident_name ? String(body.resident_name) : ''
    const type = String(body.type ?? 'Visit')
    const doctor_name = String(body.doctor_name ?? '')
    const appt_date = String(body.date ?? body.appt_date ?? '').trim()
    if (!appt_date) {
      return NextResponse.json({ error: 'date required' }, { status: 400 })
    }
    const appt_time = body.time ? String(body.time) : null
    const location = body.location ? String(body.location) : null
    const address = body.address ? String(body.address) : null
    const notes = body.notes ? String(body.notes) : null
    const checklist_json = JSON.stringify(
      Array.isArray(body.checklist) ? body.checklist : []
    )
    const sql = getSql()
    const [row] = resident_id
      ? await sql`
          INSERT INTO appointments (resident_id, resident_name, type, doctor_name, appt_date, appt_time, location, address, notes, checklist_json)
          VALUES (${resident_id}::uuid, ${resident_name}, ${type}, ${doctor_name}, ${appt_date}, ${appt_time}, ${location}, ${address}, ${notes}, ${checklist_json})
          RETURNING *
        `
      : await sql`
          INSERT INTO appointments (resident_id, resident_name, type, doctor_name, appt_date, appt_time, location, address, notes, checklist_json)
          VALUES (NULL, ${resident_name}, ${type}, ${doctor_name}, ${appt_date}, ${appt_time}, ${location}, ${address}, ${notes}, ${checklist_json})
          RETURNING *
        `
    void sendCareNotification(
      `Appointment scheduled: ${type}`,
      `<p>${doctor_name} on ${appt_date}</p>`
    )
    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
