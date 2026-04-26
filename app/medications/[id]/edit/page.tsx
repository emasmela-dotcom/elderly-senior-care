'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditMedicationPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params?.id ?? '')
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [times, setTimes] = useState('')
  const [notes, setNotes] = useState('')
  const [photo_base64, setPhotoBase64] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/medications', { credentials: 'same-origin' })
        const list = await res.json()
        if (!res.ok || cancelled) return
        const row = (Array.isArray(list) ? list : []).find(
          (m: { id: string }) => m.id === id
        )
        if (!row) {
          setError('Not found')
          return
        }
        setName(row.name ?? '')
        setDosage(row.dosage ?? '')
        setFrequency(row.frequency ?? '')
        setTimes(Array.isArray(row.times) ? row.times.join(', ') : '')
        setNotes(row.notes ?? '')
        setPhotoBase64(row.photoUrl ?? null)
      } catch {
        setError('Network error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

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
      const res = await fetch(`/api/medications/${id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          dosage,
          frequency,
          times: timeList,
          photo_base64,
          notes,
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-garden-wood/75">Loading…</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-garden-wood mb-6">Edit medication</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-garden-sage-200/65 p-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-garden-wood mb-1">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-garden-wood mb-1">
            Dosage
          </label>
          <input
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-garden-wood mb-1">
            Frequency
          </label>
          <input
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="times" className="block text-sm font-medium text-garden-wood mb-1">
            Times (comma-separated)
          </label>
          <input
            id="times"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="pill" className="block text-sm font-medium text-garden-wood mb-1">
            Replace pill photo
          </label>
          <input id="pill" type="file" accept="image/*" onChange={onFile} className="w-full text-sm" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-garden-wood mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
          <Link href="/medications" className="px-4 py-2 border border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
