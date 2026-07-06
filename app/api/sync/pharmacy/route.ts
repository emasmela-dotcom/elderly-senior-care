import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { getMedicationColumnMap } from '@/lib/schemaCompat'
import { parsePharmacyCsv } from '@/lib/sync/parsePharmacyCsv'

const MAX_BYTES = 2 * 1024 * 1024

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
      return NextResponse.json({ error: 'Select who these medications are for.' }, { status: 400 })
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Upload a pharmacy CSV file.' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File is too large (max 2MB).' }, { status: 400 })
    }

    const meds = parsePharmacyCsv(await file.text())
    if (meds.length === 0) {
      return NextResponse.json(
        { error: 'No medications found. Use a CSV with a Drug or Medication column.' },
        { status: 400 }
      )
    }

    const sql = getSql()
    const cols = await getMedicationColumnMap(sql)
    let imported = 0
    let skipped = 0

    for (const med of meds) {
      const existing = await sql`
        SELECT id FROM medications
        WHERE resident_id = ${resident_id}::uuid
          AND lower(name) = lower(${med.name})
          AND notes LIKE '%[pharmacy:csv]%'
        LIMIT 1
      `
      if ((existing as unknown[]).length > 0) {
        skipped++
        continue
      }

      if (cols.times === 'times_json') {
        await sql`
          INSERT INTO medications (resident_id, name, dosage, frequency, times_json, notes)
          VALUES (${resident_id}::uuid, ${med.name}, ${med.dosage}, ${med.frequency}, '[]', ${med.notes})
        `
      } else {
        await sql`
          INSERT INTO medications (resident_id, name, dosage, frequency, times, notes)
          VALUES (${resident_id}::uuid, ${med.name}, ${med.dosage}, ${med.frequency}, '[]', ${med.notes})
        `
      }
      imported++
    }

    return NextResponse.json({ imported, skipped, total: meds.length })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
