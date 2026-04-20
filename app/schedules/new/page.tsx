'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewSchedulePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [schedule_type, setScheduleType] = useState('')
  const [start_date, setStartDate] = useState('')
  const [end_date, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          schedule_type: schedule_type || null,
          start_date: start_date || null,
          end_date: end_date || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/schedules')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create schedule</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-gray-200 p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
            Title
          </label>
          <input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="schedule_type" className="block text-sm font-medium text-gray-900 mb-1">
            Type
          </label>
          <input
            id="schedule_type"
            value={schedule_type}
            onChange={(e) => setScheduleType(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-900 mb-1">
              Start
            </label>
            <input
              id="start_date"
              type="date"
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-900 mb-1">
              End
            </label>
            <input
              id="end_date"
              type="date"
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>
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
            className="px-4 py-2 bg-blue-600 text-white border border-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link href="/schedules" className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
