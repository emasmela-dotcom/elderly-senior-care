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
    const rows = await sql`
      SELECT h.*, r.full_name AS resident_name
      FROM health_records h
      LEFT JOIN residents r ON r.id = h.resident_id
      ORDER BY h.created_at DESC
    `
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
    const resident_id = body.resident_id ? String(body.resident_id).trim() : null
    const content = body.content ? String(body.content) : null
    const record_type = body.record_type ? String(body.record_type) : null
    const sql = getSql()
    const [row] = resident_id
      ? await sql`
          INSERT INTO health_records (resident_id, title, content, record_type)
          VALUES (${resident_id}::uuid, ${title}, ${content}, ${record_type})
          RETURNING *
        `
      : await sql`
          INSERT INTO health_records (resident_id, title, content, record_type)
          VALUES (NULL, ${title}, ${content}, ${record_type})
          RETURNING *
        `
    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
