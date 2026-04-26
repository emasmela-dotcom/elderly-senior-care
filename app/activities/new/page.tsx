'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewActivityPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [activity_date, setActivityDate] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          activity_date: activity_date || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/activities')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-garden-wood mb-6">Add activity</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-garden-sage-200/65 p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-garden-wood mb-1">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-garden-wood mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="activity_date" className="block text-sm font-medium text-garden-wood mb-1">
            Date
          </label>
          <input
            id="activity_date"
            type="date"
            value={activity_date}
            onChange={(e) => setActivityDate(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link href="/activities" className="px-4 py-2 border border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
