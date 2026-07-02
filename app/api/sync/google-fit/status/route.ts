import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'
import { refreshGoogleAccessToken } from '@/lib/sync/googleOAuth'

export async function GET() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  const cookieStore = await cookies()
  const connected = !!(
    cookieStore.get('gfit_access_token')?.value ||
    cookieStore.get('gfit_refresh_token')?.value
  )

  return NextResponse.json({ connected })
}
