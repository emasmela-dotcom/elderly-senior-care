import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'

export async function GET() {
  try {
    const sql = getSql()
    const rows = await sql`SELECT 1 AS ok`
    return NextResponse.json({ ok: true, result: rows[0] })
  } catch (e) {
    const message =
      process.env.NODE_ENV === 'development' ? String(e) : 'Database unavailable'
    return NextResponse.json({ ok: false, error: message }, { status: 503 })
  }
}
