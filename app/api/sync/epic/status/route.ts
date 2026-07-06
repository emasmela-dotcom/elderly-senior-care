import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { requireSession } from '@/lib/requireAuth'

export async function GET() {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response

  const cookieStore = await cookies()
  const connected = !!cookieStore.get('epic_access_token')?.value

  return NextResponse.json({ connected })
}
