import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { getMedicationColumnMap } from '@/lib/schemaCompat'

type Ctx = { params: { id: string } }

function readTimesField(cur: Record<string, unknown>, timesCol: 'times_json' | 'times'): string {
  const raw = cur[timesCol]
  return typeof raw === 'string' ? raw : '[]'
}

function readPhotoField(
  cur: Record<string, unknown>,
  photoCol: 'photo_base64' | 'photo_url'
): string | null {
  const raw = cur[photoCol]
  return raw == null ? null : String(raw)
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'PATCH')
  if (g) return g
  const { id } = ctx.params
  try {
    const body = await req.json()
    const sql = getSql()
    const cols = await getMedicationColumnMap(sql)
    const [cur] = await sql`SELECT * FROM medications WHERE id = ${id}::uuid`
    if (!cur) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const c = cur as Record<string, unknown>
    const name = body.name !== undefined ? String(body.name) : c.name
    const dosage = body.dosage !== undefined ? String(body.dosage) : c.dosage
    const frequency =
      body.frequency !== undefined ? String(body.frequency) : c.frequency
    const timesValue =
      body.times !== undefined
        ? JSON.stringify(Array.isArray(body.times) ? body.times : [])
        : readTimesField(c, cols.times)
    const photoValue =
      body.photo_base64 !== undefined
        ? body.photo_base64 === null
          ? null
          : String(body.photo_base64)
        : readPhotoField(c, cols.photo)
    const notes = body.notes !== undefined ? String(body.notes) : c.notes

    const [row] =
      cols.times === 'times_json'
        ? await sql`
            UPDATE medications SET
              name = ${name},
              dosage = ${dosage},
              frequency = ${frequency},
              times_json = ${timesValue},
              photo_base64 = ${photoValue},
              notes = ${notes}
            WHERE id = ${id}::uuid
            RETURNING id, resident_id, name, dosage, frequency, times_json, photo_base64, start_date, end_date, notes, created_at
          `
        : await sql`
            UPDATE medications SET
              name = ${name},
              dosage = ${dosage},
              frequency = ${frequency},
              times = ${timesValue},
              photo_url = ${photoValue},
              notes = ${notes}
            WHERE id = ${id}::uuid
            RETURNING id, resident_id, name, dosage, frequency, times AS times_json, photo_url AS photo_base64, start_date, end_date, notes, created_at
          `

    let times: string[] = []
    try {
      times = JSON.parse((row as { times_json: string }).times_json || '[]')
    } catch {
      times = []
    }
    return NextResponse.json({ ...(row as object), times })
  } catch (e) {
    return dbErrorResponse(e)
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'DELETE')
  if (g) return g
  const { id } = ctx.params
  try {
    const sql = getSql()
    await sql`DELETE FROM medications WHERE id = ${id}::uuid`
    return NextResponse.json({ ok: true })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
