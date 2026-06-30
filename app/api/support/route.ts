import { NextResponse } from 'next/server'
import { sendSupportMessage } from '@/lib/notify'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = String(body.name ?? '').trim()
    const email = String(body.email ?? '').trim()
    const message = String(body.message ?? '').trim()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in your name, email, and message.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long. Please shorten it and try again.' },
        { status: 400 }
      )
    }

    const result = await sendSupportMessage({ name, email, message })

    if (!result.sent) {
      return NextResponse.json(
        {
          error:
            'We could not send your message right now. Please try again in a few minutes.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
