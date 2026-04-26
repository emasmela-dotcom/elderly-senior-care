'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Resident = { id: string; full_name: string }

export default function NewSymptomPage() {
  const router = useRouter()
  const [residents, setResidents] = useState<Resident[]>([])
  const [resident_id, setResidentId] = useState('')
  const [resident_name, setResidentName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild')
  const [duration, setDuration] = useState('')
  const [triggers, setTriggers] = useState('')
  const [notes, setNotes] = useState('')
  const [recorded_by, setRecordedBy] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void (async () => {
      const res = await fetch('/api/residents', { credentials: 'same-origin' })
      const data = await res.json()
      if (res.ok && Array.isArray(data)) setResidents(data)
    })()
  }, [])

  useEffect(() => {
    const r = residents.find((x) => x.id === resident_id)
    setResidentName(r?.full_name ?? '')
  }, [resident_id, residents])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/symptoms', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id,
          resident_name,
          date,
          time: time || null,
          symptoms,
          severity,
          duration: duration || null,
          triggers: triggers || null,
          notes: notes || null,
          recorded_by: recorded_by || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/symptoms')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-garden-wood mb-6">Log symptoms</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-garden-sage-200/65 p-6">
        <div>
          <label htmlFor="resident_id" className="block text-sm font-medium text-garden-wood mb-1">
            Resident
          </label>
          <select
            id="resident_id"
            required
            value={resident_id}
            onChange={(e) => setResidentId(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
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
          <label htmlFor="date" className="block text-sm font-medium text-garden-wood mb-1">
            Date
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-garden-wood mb-1">
            Time
          </label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-garden-wood mb-1">
            Symptoms
          </label>
          <textarea
            id="symptoms"
            required
            rows={4}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-garden-wood mb-2">Severity</span>
          <div className="flex gap-4">
            {(['mild', 'moderate', 'severe'] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 text-garden-wood">
                <input
                  type="radio"
                  name="severity"
                  value={s}
                  checked={severity === s}
                  onChange={() => setSeverity(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-garden-wood mb-1">
            Duration
          </label>
          <input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="triggers" className="block text-sm font-medium text-garden-wood mb-1">
            Triggers
          </label>
          <input
            id="triggers"
            value={triggers}
            onChange={(e) => setTriggers(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-garden-wood mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-garden-clay-200/85 px-3 py-2 text-garden-wood"
          />
        </div>
        <div>
          <label htmlFor="recorded_by" className="block text-sm font-medium text-garden-wood mb-1">
            Recorded by
          </label>
          <input
            id="recorded_by"
            value={recorded_by}
            onChange={(e) => setRecordedBy(e.target.value)}
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
          <Link href="/symptoms" className="px-4 py-2 border border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
