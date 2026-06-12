import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'

const REQUIRED_TABLES = [
  'residents',
  'caregivers',
  'medications',
  'vital_signs',
  'appointments',
  'symptom_logs',
  'schedules',
  'activities',
  'health_records',
  'safety_incidents',
] as const

/** Public diagnostic: verifies DATABASE_URL and that schema tables exist. */
export async function GET() {
  try {
    const sql = getSql()
    const ping = await sql`SELECT 1 AS ok`
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    const tableNames = (tables as { table_name: string }[]).map((r) => r.table_name)
    const missing = REQUIRED_TABLES.filter((t) => !tableNames.includes(t))

    let medicationColumns: string[] = []
    if (tableNames.includes('medications')) {
      const cols = await sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'medications'
        ORDER BY ordinal_position
      `
      medicationColumns = (cols as { column_name: string }[]).map((r) => r.column_name)
    }

    return NextResponse.json({
      ok: missing.length === 0,
      ping: ping[0],
      tableCount: tableNames.length,
      tables: tableNames,
      missingTables: missing,
      medicationColumns,
      hint:
        missing.length > 0
          ? 'Run db/schema.sql in Neon on the SAME branch as your DATABASE_URL connection string.'
          : 'Schema looks complete.',
    })
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : String(e),
        hint: 'Check DATABASE_URL in Vercel matches your Neon project branch (e.g. production).',
      },
      { status: 503 }
    )
  }
}
