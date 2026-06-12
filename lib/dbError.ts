import { NextResponse } from 'next/server'

export function dbErrorResponse(error: unknown) {
  const detail = error instanceof Error ? error.message : String(error)
  const message =
    process.env.NODE_ENV === 'development'
      ? detail
      : 'Database unavailable. Set DATABASE_URL and run db/schema.sql in Neon.'
  return NextResponse.json({ error: message, detail }, { status: 503 })
}
