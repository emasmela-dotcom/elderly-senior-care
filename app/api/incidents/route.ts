import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { sendCareNotification } from '@/lib/notify'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'GET')
  if (g) return g
  try {
    const sql = getSql()
    const rows =
      await sql`SELECT * FROM safety_incidents ORDER BY created_at DESC`
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
    const title = String(body.title ?? '').trim()
    if (!title) {
      return NextResponse.json({ error: 'title required' }, { status: 400 })
    }
    const description = body.description ? String(body.description) : null
    const severity = body.severity ? String(body.severity) : null
    const sql = getSql()
    const [row] =
      await sql`INSERT INTO safety_incidents (title, description, severity) VALUES (${title}, ${description}, ${severity}) RETURNING *`
    void sendCareNotification(
      `Safety incident reported: ${title}`,
      `<p>${description ?? ''}</p>`
    )
    return NextResponse.json(row, { status: 201 })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
