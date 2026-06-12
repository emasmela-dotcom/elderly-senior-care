import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { sendCareNotification } from '@/lib/notify'
import { getMedicationColumnMap } from '@/lib/schemaCompat'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'GET')
  if (g) return g
  try {
    const sql = getSql()
    const cols = await getMedicationColumnMap(sql)
    const rows =
      cols.times === 'times_json'
        ? await sql`
            SELECT m.id, m.resident_id, m.name, m.dosage, m.frequency, m.times_json, m.photo_base64,
                   m.start_date, m.end_date, m.notes, m.created_at, r.full_name AS resident_name
            FROM medications m
            LEFT JOIN residents r ON r.id = m.resident_id
            ORDER BY m.created_at DESC
          `
        : await sql`
            SELECT m.id, m.resident_id, m.name, m.dosage, m.frequency, m.times AS times_json, m.photo_url AS photo_base64,
                   m.start_date, m.end_date, m.notes, m.created_at, r.full_name AS resident_name
            FROM medications m
            LEFT JOIN residents r ON r.id = m.resident_id
            ORDER BY m.created_at DESC
          `
    const mapped = (rows as Record<string, unknown>[]).map((r) => ({
      id: r.id,
      residentId: r.resident_id,
      residentName: (r.resident_name as string) || '',
      name: r.name,
      dosage: (r.dosage as string) || '',
      frequency: (r.frequency as string) || '',
      times: safeJsonArray(r.times_json),
      photoUrl: (r.photo_base64 as string) || undefined,
      startDate: (r.start_date as string) || '',
      endDate: (r.end_date as string) || undefined,
      notes: (r.notes as string) || undefined,
    }))
    return NextResponse.json(mapped)
  } catch (e) {
    return dbErrorResponse(e)
  }
}

function safeJsonArray(v: unknown): string[] {
  if (typeof v !== 'string') return []
  try {
    const p = JSON.parse(v)
    return Array.isArray(p) ? p.map(String) : []
  } catch {
    return v.includes(',') ? v.split(',').map((s) => s.trim()).filter(Boolean) : []
  }
}

export async function POST(req: Request) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'POST')
  if (g) return g
  try {
    const body = await req.json()
    const resident_id = String(body.resident_id ?? '').trim()
    const name = String(body.name ?? '').trim()
    if (!resident_id || !name) {
      return NextResponse.json(
        { error: 'resident_id and name required' },
        { status: 400 }
      )
    }
    const dosage = body.dosage ? String(body.dosage) : ''
    const frequency = body.frequency ? String(body.frequency) : ''
    const times = Array.isArray(body.times) ? body.times.map(String) : []
    const timesValue = JSON.stringify(times)
    const photoValue = body.photo_base64 ? String(body.photo_base64) : null
    const start_date = body.start_date ? String(body.start_date) : null
    const end_date = body.end_date ? String(body.end_date) : null
    const notes = body.notes ? String(body.notes) : null
    const sql = getSql()
    const cols = await getMedicationColumnMap(sql)

    const [row] =
      cols.times === 'times_json'
        ? await sql`
            INSERT INTO medications (resident_id, name, dosage, frequency, times_json, photo_base64, start_date, end_date, notes)
            VALUES (${resident_id}::uuid, ${name}, ${dosage}, ${frequency}, ${timesValue}, ${photoValue}, ${start_date}, ${end_date}, ${notes})
            RETURNING id, resident_id, name, dosage, frequency, times_json, photo_base64, start_date, end_date, notes, created_at
          `
        : await sql`
            INSERT INTO medications (resident_id, name, dosage, frequency, times, photo_url, start_date, end_date, notes)
            VALUES (${resident_id}::uuid, ${name}, ${dosage}, ${frequency}, ${timesValue}, ${photoValue}, ${start_date}, ${end_date}, ${notes})
            RETURNING id, resident_id, name, dosage, frequency, times AS times_json, photo_url AS photo_base64, start_date, end_date, notes, created_at
          `

    void sendCareNotification(
      `Medication added: ${name}`,
      `<p>A new medication was recorded for a resident.</p>`
    )
    return NextResponse.json(
      {
        ...row,
        times: safeJsonArray((row as { times_json: string }).times_json),
      },
      { status: 201 }
    )
  } catch (e) {
    return dbErrorResponse(e)
  }
}
