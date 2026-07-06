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
    const rows =
      await sql`SELECT * FROM schedules ORDER BY created_at DESC`
    return NextResponse.json(rows)
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
    const title = String(body.title ?? '').trim()
    if (!title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 })
    }
    const description = body.description ? String(body.description) : null
    const schedule_type = body.schedule_type ? String(body.schedule_type) : null
    const start_date = body.start_date ? String(body.start_date) : null
    const end_date = body.end_date ? String(body.end_date) : null
    const sql = getSql()
    const [row] =
      await sql`INSERT INTO schedules (title, description, schedule_type, start_date, end_date) VALUES (${title}, ${description}, ${schedule_type}, ${start_date}, ${end_date}) RETURNING *`
    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
