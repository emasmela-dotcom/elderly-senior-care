import { Resend } from 'resend'

const SUPPORT_INBOX = 'apputilitybuilder@gmail.com'
const DEFAULT_FROM = 'CareConnect <onboarding@resend.dev>'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function resendFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM
}

type SendResult =
  | { sent: true }
  | { sent: false; fallbackEmail: string; logMessage?: string }

/** Sends email when RESEND_API_KEY and NOTIFY_TO_EMAIL are set; otherwise logs only. */
export async function sendCareNotification(
  subject: string,
  html: string
): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY?.trim()
  const to = process.env.NOTIFY_TO_EMAIL?.trim()
  if (!key || !to) {
    console.info('[notify]', subject)
    return { sent: false }
  }

  const resend = new Resend(key)
  const { error } = await resend.emails.send({
    from: resendFromAddress(),
    to: [to],
    subject,
    html,
  })

  if (error) {
    console.error('[notify] resend error', error)
    return { sent: false }
  }

  return { sent: true }
}

export async function sendSupportMessage(opts: {
  name: string
  email: string
  message: string
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY?.trim()
  const to = process.env.NOTIFY_TO_EMAIL?.trim() || SUPPORT_INBOX
  const subject = `CareConnect support from ${opts.name}`
  const html = `<p><strong>Name:</strong> ${escapeHtml(opts.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(opts.email)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(opts.message).replace(/\n/g, '<br>')}</p>`

  if (!key) {
    console.error('[support] RESEND_API_KEY is not set')
    return { sent: false, fallbackEmail: SUPPORT_INBOX }
  }

  try {
    const resend = new Resend(key)
    const { data, error } = await resend.emails.send({
      from: resendFromAddress(),
      to: [to],
      replyTo: opts.email,
      subject,
      html,
    })

    if (error) {
      console.error('[support] resend error', error)
      return {
        sent: false,
        fallbackEmail: SUPPORT_INBOX,
        logMessage: error.message,
      }
    }

    if (!data?.id) {
      console.error('[support] resend returned no id', data)
      return { sent: false, fallbackEmail: SUPPORT_INBOX }
    }

    return { sent: true }
  } catch (e) {
    console.error('[support] network error', e)
    return { sent: false, fallbackEmail: SUPPORT_INBOX }
  }
}
