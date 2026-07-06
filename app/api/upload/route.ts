import { NextResponse } from 'next/server'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'

const MAX_BYTES = 350_000

export async function POST(req: Request) {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response
  const g = familyReadOnlyGuard(auth.session, 'POST')
  if (g) return g
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'file field required' }, { status: 400 })
  }
  const buf = Buffer.from(await file.arrayBuffer())
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large' }, { status: 413 })
  }
  const mime = (file as File).type || 'application/octet-stream'
  const b64 = buf.toString('base64')
  const dataUrl = `data:${mime};base64,${b64}`
  return NextResponse.json({ dataUrl, bytes: buf.length })
}
