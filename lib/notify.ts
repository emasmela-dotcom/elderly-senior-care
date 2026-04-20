import { Resend } from 'resend'

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
