'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Resident = { id: string; full_name: string }

export default function NewAppointmentPage() {
  const router = useRouter()
  const [residents, setResidents] = useState<Resident[]>([])
  const [resident_id, setResidentId] = useState('')
  const [resident_name, setResidentName] = useState('')
  const [type, setType] = useState('Checkup')
  const [doctor_name, setDoctorName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
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
      const res = await fetch('/api/appointments', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id: resident_id || null,
          resident_name: resident_name || 'Unknown',
          type,
          doctor_name,
          date,
          time,
          location: location || null,
          notes: notes || null,
          checklist: [],
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/appointments')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Schedule appointment</h1>
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
          <label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-1">
            Type
          </label>
          <input
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="doctor_name" className="block text-sm font-medium text-gray-900 mb-1">
            Doctor name
          </label>
          <input
            id="doctor_name"
            value={doctor_name}
            onChange={(e) => setDoctorName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-900 mb-1">
            Date
          </label>
          <input
            id="date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-900 mb-1">
            Time
          </label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-1">
            Location
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
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
            className="px-4 py-2 bg-blue-600 text-white border border-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link href="/appointments" className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
