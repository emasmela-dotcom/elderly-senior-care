import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'

export async function GET() {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'GET')
  if (g) return g
  try {
    const sql = getSql()
    const rows = await sql`
      SELECT v.*, r.full_name AS resident_name
      FROM vital_signs v
      LEFT JOIN residents r ON r.id = v.resident_id
      ORDER BY v.recorded_at DESC
    `
    const mapped = rows.map((r: Record<string, unknown>) => {
      const d = new Date(String(r.recorded_at))
      const iso = d.toISOString().slice(0, 10)
      const time = d.toTimeString().slice(0, 5)
      return {
        id: r.id,
        residentId: r.resident_id,
        residentName: r.resident_name || 'Unknown',
        date: iso,
        time,
        bloodPressure:
          r.blood_pressure_systolic != null && r.blood_pressure_diastolic != null
            ? {
                systolic: Number(r.blood_pressure_systolic),
                diastolic: Number(r.blood_pressure_diastolic),
              }
            : undefined,
        heartRate:
          r.heart_rate != null ? Number(r.heart_rate) : undefined,
        temperature:
          r.temperature != null ? Number(r.temperature) : undefined,
        weight: r.weight != null ? Number(r.weight) : undefined,
        glucose: r.glucose != null ? Number(r.glucose) : undefined,
        recordedBy: r.recorded_by || '',
      }
    })
    return NextResponse.json(mapped)
  } catch (e) {
    return dbErrorResponse(e)
  }
}

export async function POST(req: Request) {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'POST')
  if (g) return g
  try {
    const body = await req.json()
    const resident_id = String(body.resident_id ?? '').trim()
    if (!resident_id) {
      return NextResponse.json({ error: 'resident_id required' }, { status: 400 })
    }
    const recorded_by = body.recorded_by ? String(body.recorded_by) : null
    const sys = body.blood_pressure_systolic ?? null
    const dia = body.blood_pressure_diastolic ?? null
    const heart_rate = body.heart_rate ?? null
    const temperature = body.temperature ?? null
    const weight = body.weight ?? null
    const glucose = body.glucose ?? null
    const sql = getSql()
    await sql`
      INSERT INTO vital_signs (
        resident_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic,
        heart_rate, temperature, weight, glucose, recorded_by
      ) VALUES (
        ${resident_id}::uuid, now(),
        ${sys}, ${dia}, ${heart_rate}, ${temperature}, ${weight}, ${glucose}, ${recorded_by}
      )
    `
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
