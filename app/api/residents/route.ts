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
      await sql`SELECT id, full_name, room_number, notes, created_at FROM residents ORDER BY created_at DESC`
    return NextResponse.json(rows)
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
    const full_name = String(body.full_name ?? '').trim()
    if (!full_name) {
      return NextResponse.json({ error: 'full_name required' }, { status: 400 })
    }
    const room_number = body.room_number ? String(body.room_number) : null
    const notes = body.notes ? String(body.notes) : null
    const sql = getSql()
    const [row] =
      await sql`INSERT INTO residents (full_name, room_number, notes) VALUES (${full_name}, ${room_number}, ${notes}) RETURNING id, full_name, room_number, notes, created_at`
    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
