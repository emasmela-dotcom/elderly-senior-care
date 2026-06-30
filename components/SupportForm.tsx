'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

export function SupportForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      const data: unknown = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data as { error?: string }).error ?? 'Could not send message.'
        setError(msg)
        return
      }
      setSent(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-4" role="status">
        <p className="text-base text-garden-wood">
          Thanks — your message was sent. We&apos;ll reply to <strong>{email}</strong>.
        </p>
        <Link
          href="/"
          className="inline-flex px-4 py-2.5 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 min-h-[44px] items-center"
        >
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="support-name" className="block text-sm font-medium text-garden-wood mb-1">
          Your name
        </label>
        <input
          id="support-name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-garden-clay-200/85 px-3 py-2.5 text-garden-wood min-h-[44px]"
        />
      </div>
      <div>
        <label htmlFor="support-email" className="block text-sm font-medium text-garden-wood mb-1">
          Your email
        </label>
        <input
          id="support-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-garden-clay-200/85 px-3 py-2.5 text-garden-wood min-h-[44px]"
        />
      </div>
      <div>
        <label htmlFor="support-message" className="block text-sm font-medium text-garden-wood mb-1">
          How can we help?
        </label>
        <textarea
          id="support-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-garden-clay-200/85 px-3 py-2.5 text-garden-wood"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 disabled:opacity-60 min-h-[44px]"
        >
          {saving ? 'Sending…' : 'Send message'}
        </button>
        <Link
          href="/"
          className="px-4 py-2.5 border border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70 min-h-[44px] inline-flex items-center"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
