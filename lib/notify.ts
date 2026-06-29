import { Resend } from 'resend'

const SUPPORT_INBOX = 'apputilitybuilder@gmail.com'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Sends email when RESEND_API_KEY and NOTIFY_TO_EMAIL are set; otherwise logs only. */
export async function sendCareNotification(subject: string, html: string) {
  const key = process.env.RESEND_API_KEY?.trim()
  const to = process.env.NOTIFY_TO_EMAIL?.trim()
  if (!key || !to) {
    console.info('[notify]', subject)
    return { sent: false as const }
  }
  try {
    const resend = new Resend(key)
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      'CareConnect <onboarding@resend.dev>'
    await resend.emails.send({ from, to: [to], subject, html })
    return { sent: true as const }
  } catch (e) {
    console.error('[notify] send failed', e)
    return { sent: false as const }
  }
}

export async function sendSupportMessage(opts: {
  name: string
  email: string
  message: string
}) {
  const key = process.env.RESEND_API_KEY?.trim()
  const to = process.env.NOTIFY_TO_EMAIL?.trim() || SUPPORT_INBOX
  const subject = `CareConnect support from ${opts.name}`
  const html = `<p><strong>Name:</strong> ${escapeHtml(opts.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(opts.email)}</p>
<p><strong>Message:</strong></p>
<p>${escapeHtml(opts.message).replace(/\n/g, '<br>')}</p>`

  if (!key) {
    console.info('[support]', subject, opts)
    return { sent: false as const, fallbackEmail: SUPPORT_INBOX }
  }

  try {
    const resend = new Resend(key)
    const from =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      'CareConnect <onboarding@resend.dev>'
    await resend.emails.send({
      from,
      to: [to],
      reply_to: opts.email,
      subject,
      html,
    })
    return { sent: true as const, fallbackEmail: SUPPORT_INBOX }
  } catch (e) {
    console.error('[support] send failed', e)
    return { sent: false as const, fallbackEmail: SUPPORT_INBOX }
  }
}
