'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewResidentPage() {
  const router = useRouter()
  const [full_name, setFullName] = useState('')
  const [room_number, setRoomNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/residents', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name,
          room_number: room_number || null,
          notes: notes || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/residents')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-garden-wood mb-6">Add resident</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-garden-sage-200/65 p-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-garden-wood mb-1">
            Full name
          </label>
          <input
            id="full_name"
            required
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
          />
        </div>
        <div>
          <label htmlFor="room_number" className="block text-sm font-medium text-garden-wood mb-1">
            Room number
          </label>
          <input
            id="room_number"
            value={room_number}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-garden-wood mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
          />
        </div>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link
            href="/residents"
            className="px-4 py-2 border border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
