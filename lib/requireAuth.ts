import { getServerSession, type Session } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/authOptions'

export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse }

export async function requireSession(): Promise<AuthResult> {
  const session = await getServerSession(authOptions)
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }
  return { ok: true, session }
}

/** Staff may read/write. Family is read-only on whitelisted GET paths. */
export function familyReadOnlyGuard(
  session: { role?: string },
  method: string
): NextResponse | null {
  if (session.role === 'family' && method !== 'GET') {
    return NextResponse.json({ error: 'Read-only for family accounts' }, { status: 403 })
  }
  return null
}
