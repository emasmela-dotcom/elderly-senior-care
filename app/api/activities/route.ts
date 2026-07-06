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
      await sql`SELECT * FROM activities ORDER BY activity_date DESC NULLS LAST, created_at DESC`
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
    const activity_date = body.activity_date ? String(body.activity_date) : null
    const sql = getSql()
    const [row] =
      await sql`INSERT INTO activities (title, description, activity_date) VALUES (${title}, ${description}, ${activity_date}) RETURNING *`
    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
