import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'GET')
  if (g) return g
  try {
    const sql = getSql()
    const rows =
      await sql`SELECT * FROM symptom_logs ORDER BY log_date DESC, log_time DESC`
    const mapped = rows.map((r: Record<string, unknown>) => ({
      id: r.id,
      residentId: r.resident_id,
      residentName: r.resident_name,
      date: r.log_date,
      time: r.log_time,
      symptoms: r.symptoms,
      severity: r.severity,
      duration: r.duration,
      triggers: r.triggers,
      notes: r.notes,
      recordedBy: (r.recorded_by as string) || '',
    }))
    return NextResponse.json(mapped)
  } catch (e) {
    return dbErrorResponse(e)
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
    const resident_name = String(body.resident_name ?? '')
    const log_date = String(body.date ?? '').trim()
    const symptoms = String(body.symptoms ?? '').trim()
    if (!resident_id || !log_date || !symptoms) {
      return NextResponse.json(
        { error: 'resident_id, date, symptoms required' },
        { status: 400 }
      )
    }
    const log_time = body.time ? String(body.time) : null
    const sev = String(body.severity ?? 'mild')
    const severity = ['mild', 'moderate', 'severe'].includes(sev)
      ? sev
      : 'mild'
    const duration = body.duration ? String(body.duration) : null
    const triggers = body.triggers ? String(body.triggers) : null
    const notes = body.notes ? String(body.notes) : null
    const recorded_by = body.recorded_by ? String(body.recorded_by) : null
    const sql = getSql()
    await sql`
      INSERT INTO symptom_logs (resident_id, resident_name, log_date, log_time, symptoms, severity, duration, triggers, notes, recorded_by)
      VALUES (${resident_id}::uuid, ${resident_name}, ${log_date}, ${log_time}, ${symptoms}, ${severity}, ${duration}, ${triggers}, ${notes}, ${recorded_by})
    `
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
