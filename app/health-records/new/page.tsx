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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add health record</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-gray-200 p-6">
        <div>
          <label htmlFor="resident_id" className="block text-sm font-medium text-gray-900 mb-1">
            Resident (optional)
          </label>
          <select
            id="resident_id"
            value={resident_id}
            onChange={(e) => setResidentId(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
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
          <label htmlFor="record_type" className="block text-sm font-medium text-gray-900 mb-1">
            Record type
          </label>
          <input
            id="record_type"
            value={record_type}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-900 mb-1">
            Content
          </label>
          <textarea
            id="content"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link href="/health-records" className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
