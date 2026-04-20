import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'

type Ctx = { params: { id: string } }

export async function GET(_req: Request, ctx: Ctx) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'GET')
  if (g) return g
  const { id } = ctx.params
  try {
    const sql = getSql()
    const [row] =
      await sql`SELECT id, full_name, room_number, notes, created_at FROM residents WHERE id = ${id}::uuid`
    if (!row) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(row)
  } catch (e) {
    return dbErrorResponse(e)
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'PATCH')
  if (g) return g
  const { id } = ctx.params
  try {
    const body = await req.json()
    const sql = getSql()
    const [current] =
      await sql`SELECT id, full_name, room_number, notes FROM residents WHERE id = ${id}::uuid`
    if (!current) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const full_name =
      typeof body.full_name === 'string'
        ? body.full_name.trim()
        : current.full_name
    const room_number =
      body.room_number !== undefined
        ? body.room_number === null || body.room_number === ''
          ? null
          : String(body.room_number)
        : current.room_number
    const notes =
      body.notes !== undefined
        ? body.notes === null
          ? null
          : String(body.notes)
        : current.notes
    const [row] = await sql`
      UPDATE residents SET
        full_name = ${full_name},
        room_number = ${room_number},
        notes = ${notes}
      WHERE id = ${id}::uuid
      RETURNING id, full_name, room_number, notes, created_at
    `
    return NextResponse.json(row)
  } catch (e) {
    return dbErrorResponse(e)
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireSession()
  if (!auth.ok) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'DELETE')
  if (g) return g
  const { id } = ctx.params
  try {
    const sql = getSql()
    await sql`DELETE FROM residents WHERE id = ${id}::uuid`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
