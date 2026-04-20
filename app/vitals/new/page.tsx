'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Resident = { id: string; full_name: string }

export default function NewVitalPage() {
  const router = useRouter()
  const [residents, setResidents] = useState<Resident[]>([])
  const [resident_id, setResidentId] = useState('')
  const [recorded_by, setRecordedBy] = useState('')
  const [sys, setSys] = useState('')
  const [dia, setDia] = useState('')
  const [heart_rate, setHeartRate] = useState('')
  const [weight, setWeight] = useState('')
  const [glucose, setGlucose] = useState('')
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
      const res = await fetch('/api/vitals', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resident_id,
          recorded_by: recorded_by || null,
          blood_pressure_systolic: sys ? Number(sys) : null,
          blood_pressure_diastolic: dia ? Number(dia) : null,
          heart_rate: heart_rate ? Number(heart_rate) : null,
          weight: weight ? Number(weight) : null,
          glucose: glucose ? Number(glucose) : null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/vitals')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Record vitals</h1>
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
          <label htmlFor="recorded_by" className="block text-sm font-medium text-gray-900 mb-1">
            Recorded by
          </label>
          <input
            id="recorded_by"
            value={recorded_by}
            onChange={(e) => setRecordedBy(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sys" className="block text-sm font-medium text-gray-900 mb-1">
              BP systolic
            </label>
            <input
              id="sys"
              inputMode="numeric"
              value={sys}
              onChange={(e) => setSys(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="dia" className="block text-sm font-medium text-gray-900 mb-1">
              BP diastolic
            </label>
            <input
              id="dia"
              inputMode="numeric"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>
        </div>
        <div>
          <label htmlFor="hr" className="block text-sm font-medium text-gray-900 mb-1">
            Heart rate
          </label>
          <input
            id="hr"
            inputMode="numeric"
            value={heart_rate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="wt" className="block text-sm font-medium text-gray-900 mb-1">
            Weight (lbs)
          </label>
          <input
            id="wt"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="glu" className="block text-sm font-medium text-gray-900 mb-1">
            Glucose
          </label>
          <input
            id="glu"
            inputMode="numeric"
            value={glucose}
            onChange={(e) => setGlucose(e.target.value)}
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
          <Link href="/vitals" className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
