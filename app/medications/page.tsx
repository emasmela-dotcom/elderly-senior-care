'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pill, Clock, Calendar, Image as ImageIcon } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  residentId: string
  residentName: string
  photoUrl?: string
  startDate: string
  endDate?: string
  notes?: string
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/medications', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load medications')
        setMedications([])
        return
      }
      setMedications(Array.isArray(data) ? data : [])
    } catch {
      setLoadError('Network error')
      setMedications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medication Reminders</h1>
          <p className="text-gray-600 mt-1">
            Manage medications with visual pill identification and reminders
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="medications.json" data={{ medications }} />
          <Link
            href="/medications/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add Medication
          </Link>
        </div>
      </div>

      {loadError ? (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 text-red-900 text-sm" role="alert">
          {loadError}
        </div>
      ) : null}

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : medications.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden />
          <h2 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h2>
          <p className="text-gray-600 mb-4">Add medications to set up reminders with pill photos.</p>
          <Link
            href="/medications/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add Medication
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map((med) => (
            <div key={med.id} className="bg-white border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {med.photoUrl ? (
                    <img
                      src={med.photoUrl}
                      alt={`${med.name} medication`}
                      className="w-16 h-16 object-cover border border-gray-300 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 border border-gray-300 flex items-center justify-center bg-gray-50 shrink-0">
                      <ImageIcon className="text-gray-500" size={24} aria-hidden />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{med.name}</h3>
                      <span className="text-sm text-gray-700">{med.dosage}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{med.residentName}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 shrink-0" aria-hidden />
                        <span>{med.frequency}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1 shrink-0" aria-hidden />
                        <span>{med.times?.join(', ') ?? ''}</span>
                      </div>
                    </div>
                    {med.notes ? <p className="text-sm text-gray-700 mt-2">{med.notes}</p> : null}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/medications/${med.id}/edit`}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-900 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
