import { NextResponse } from 'next/server'

export function dbErrorResponse(error: unknown) {
  const message =
    process.env.NODE_ENV === 'development' && error instanceof Error
      ? error.message
      : 'Database unavailable. Set DATABASE_URL and run db/schema.sql in Neon.'
  return NextResponse.json({ error: message }, { status: 503 })
}
