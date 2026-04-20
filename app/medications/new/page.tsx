'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Resident = { id: string; full_name: string }

export default function NewMedicationPage() {
  const router = useRouter()
  const [residents, setResidents] = useState<Resident[]>([])
  const [resident_id, setResidentId] = useState('')
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [times, setTimes] = useState('08:00, 20:00')
  const [notes, setNotes] = useState('')
  const [photo_base64, setPhotoBase64] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch('/api/residents', { credentials: 'same-origin' })
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setResidents(data)
      } catch {
        /* ignore */
      }
    })()
  }, [])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.set('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd, credentials: 'same-origin' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Upload failed')
      return
    }
    setPhotoBase64((data as { dataUrl?: string }).dataUrl ?? null)
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    setSaving(true)
    setError('')
    try {
      const timeList = times
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const res = await fetch('/api/medications', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id,
          name,
          dosage,
          frequency,
          times: timeList,
          photo_base64: photo_base64 || null,
          notes: notes || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/medications')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add medication</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-gray-200 p-6">
        <div>
          <label htmlFor="resident_id" className="block text-sm font-medium text-gray-900 mb-1">
            Resident
          </label>
          <select
            id="resident_id"
            required
            value={resident_id}
            onChange={(e) => setResidentId(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          >
            <option value="">Select…</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.full_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
            Medication name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-900 mb-1">
            Dosage
          </label>
          <input
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-900 mb-1">
            Frequency
          </label>
          <input
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="times" className="block text-sm font-medium text-gray-900 mb-1">
            Times (comma-separated)
          </label>
          <input
            id="times"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="pill" className="block text-sm font-medium text-gray-900 mb-1">
            Pill photo (optional, stored in database — use only with consent)
          </label>
          <input
            id="pill"
            type="file"
            accept="image/*"
            onChange={onFile}
            className="w-full text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            className="px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link href="/medications" className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
