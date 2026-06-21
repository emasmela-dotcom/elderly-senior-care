import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const cookieStore = await cookies()
  const connected = !!(
    cookieStore.get('gcal_access_token')?.value ||
    cookieStore.get('gcal_refresh_token')?.value
  )

  return NextResponse.json({ connected })
}
