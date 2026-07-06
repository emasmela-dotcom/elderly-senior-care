import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { parseAppleHealthXml } from '@/lib/sync/parseHealthXml'

const MAX_BYTES = 10 * 1024 * 1024

export async function POST(req: Request) {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response

  const guard = familyReadOnlyGuard(auth.session, 'POST')
  if (guard) return guard

  try {
    const form = await req.formData()
    const file = form.get('file')
    const resident_id = String(form.get('resident_id') ?? '').trim()
    if (!resident_id) {
      return NextResponse.json({ error: 'Select who these vitals are for.' }, { status: 400 })
    }
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'Upload export.xml from Apple Health (unzip the export on your phone or Mac first).' },
        { status: 400 }
      )
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File is too large (max 10MB).' }, { status: 400 })
    }

    const vitals = parseAppleHealthXml(await file.text())
    if (vitals.length === 0) {
      return NextResponse.json(
        { error: 'No vitals found in the last 90 days. Try a smaller export.xml file.' },
        { status: 400 }
      )
    }

    const sql = getSql()
    let imported = 0
    let skipped = 0

    for (const row of vitals) {
      const existing = await sql`
        SELECT id FROM vital_signs
        WHERE resident_id = ${resident_id}::uuid
          AND recorded_at = ${row.recorded_at}::timestamptz
        LIMIT 1
      `
      if ((existing as unknown[]).length > 0) {
        skipped++
        continue
      }

      await sql`
        INSERT INTO vital_signs (
          resident_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic,
          heart_rate, temperature, weight, glucose, recorded_by
        ) VALUES (
          ${resident_id}::uuid, ${row.recorded_at}::timestamptz,
          ${row.blood_pressure_systolic}, ${row.blood_pressure_diastolic},
          ${row.heart_rate}, ${row.temperature}, ${row.weight}, ${row.glucose},
          'Apple Health import'
        )
      `
      imported++
    }

    return NextResponse.json({ imported, skipped, total: vitals.length })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
