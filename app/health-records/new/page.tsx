'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Resident = { id: string; full_name: string }

export default function NewHealthRecordPage() {
  const router = useRouter()
  const [residents, setResidents] = useState<Resident[]>([])
  const [resident_id, setResidentId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [record_type, setRecordType] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      const res = await fetch('/api/residents', { credentials: 'same-origin' })
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setResidents(data)
    })()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/health-records', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: resident_id || null,
          title,
          content: content || null,
          record_type: record_type || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/health-records')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-garden-wood mb-6">Add health record</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-garden-sage-200/65 p-6">
        <div>
          <label htmlFor="resident_id" className="block text-sm font-medium text-garden-wood mb-1">
            Resident (optional)
          </label>
          <select
            id="resident_id"
            value={resident_id}
            onChange={(e) => setResidentId(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          >
            <option value="">—</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.full_name}
              </option>
            ))}
          </select>
        </div>
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
          <label htmlFor="record_type" className="block text-sm font-medium text-garden-wood mb-1">
            Record type
          </label>
          <input
            id="record_type"
            value={record_type}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-garden-wood mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
          <Link href="/health-records" className="px-4 py-2 border border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
