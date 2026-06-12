import type { NeonQueryFunction } from '@neondatabase/serverless'

export type MedicationColumnMap = {
  times: 'times_json' | 'times'
  photo: 'photo_base64' | 'photo_url'
}

let medicationColumns: MedicationColumnMap | null = null

export async function getMedicationColumnMap(
  sql: NeonQueryFunction<false, false>
): Promise<MedicationColumnMap> {
  if (medicationColumns) return medicationColumns

  const cols = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'medications'
  `
  const names = new Set((cols as { column_name: string }[]).map((c) => c.column_name))

  medicationColumns = {
    times: names.has('times_json') ? 'times_json' : 'times',
    photo: names.has('photo_base64') ? 'photo_base64' : 'photo_url',
  }
  return medicationColumns
}
