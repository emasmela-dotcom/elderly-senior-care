import type { NeonQueryFunction } from '@neondatabase/serverless'

export type AppointmentImportRow = {
  dedupeTag: string
  type: string
  doctor_name: string
  appt_date: string
  appt_time: string | null
  location: string | null
  notes: string
}

export async function importAppointmentRows(
  sql: NeonQueryFunction<false, false>,
  rows: AppointmentImportRow[]
): Promise<{ imported: number; skipped: number; total: number }> {
  let imported = 0
  let skipped = 0

  for (const row of rows) {
    const dedupePattern = `%${row.dedupeTag}%`
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
        (NULL, '', ${row.type}, ${row.doctor_name},
         ${row.appt_date}, ${row.appt_time},
         ${row.location}, ${row.notes}, '[]')
    `
    imported++
  }

  return { imported, skipped, total: rows.length }
}
