'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewIncidentPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          severity: severity || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/safety')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Report incident</h1>
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
          <label htmlFor="severity" className="block text-sm font-medium text-gray-900 mb-1">
            Severity
          </label>
          <input
            id="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
            placeholder="e.g. low / medium / high"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
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
            className="px-4 py-2 bg-blue-600 text-white border border-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Submit'}
          </button>
          <Link href="/safety" className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
