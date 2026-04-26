'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText, Calendar } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import { format } from 'date-fns'

interface SymptomLog {
  id: string
  residentId: string
  residentName: string
  date: string
  time: string
  symptoms: string
  severity: 'mild' | 'moderate' | 'severe'
  duration?: string
  triggers?: string
  notes?: string
  recordedBy: string
}

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState<string>('')

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/symptoms', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load symptoms')
        setSymptoms([])
        return
      }
      setSymptoms(Array.isArray(data) ? data : [])
    } catch {
      setLoadError('Network error')
      setSymptoms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filteredSymptoms = filterDate
    ? symptoms.filter((s) => s.date === filterDate)
    : symptoms

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-garden-wood">Symptom Logging</h1>
          <p className="text-garden-wood/75 mt-1">Track daily health notes and symptoms for doctor visits</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton
            filename="symptoms.json"
            data={{ filterDate, symptoms: filteredSymptoms }}
          />
          <Link
            href="/symptoms/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Log Symptoms
          </Link>
        </div>
      </div>

      {loadError ? (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 text-red-900 text-sm" role="alert">
          {loadError}
        </div>
      ) : null}

      {loading ? (
        <p className="text-garden-wood/75">Loading…</p>
      ) : (
        <>
          {symptoms.length > 0 ? (
            <div className="bg-white border border-garden-sage-200/65 p-4 mb-6">
              <label htmlFor="symptom-filter-date" className="block text-sm font-medium text-garden-wood mb-2">
                Filter by Date
              </label>
              <input
                id="symptom-filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 border border-garden-clay-200/85 text-garden-wood focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
              />
            </div>
          ) : null}

          {filteredSymptoms.length === 0 ? (
            <div className="bg-white border border-garden-sage-200/65 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-garden-wood/45 mb-4" aria-hidden />
              <h2 className="text-lg font-medium text-garden-wood mb-2">
                {symptoms.length === 0
                  ? 'No symptoms logged yet'
                  : 'No symptoms found for selected date'}
              </h2>
              <p className="text-garden-wood/75 mb-4">
                {symptoms.length === 0
                  ? 'Start logging symptoms to track health patterns and prepare for doctor visits.'
                  : 'Try selecting a different date or log new symptoms.'}
              </p>
              <Link
                href="/symptoms/new"
                className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
              >
                <Plus size={20} className="mr-2" aria-hidden />
                Log Symptoms
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSymptoms.map((symptom) => (
                <div key={symptom.id} className="bg-white border border-garden-sage-200/65 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-garden-wood">{symptom.residentName}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium border ${
                            symptom.severity === 'severe'
                              ? 'border-garden-clay-600 bg-garden-clay-100 text-garden-wood'
                              : symptom.severity === 'moderate'
                                ? 'border-garden-sage-400 bg-garden-sage-50/70 text-garden-wood/80'
                                : 'border-garden-clay-200/85 bg-white text-garden-wood/75'
                          }`}
                        >
                          {symptom.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-garden-wood/75 mb-3">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1 shrink-0" aria-hidden />
                          <span>
                            {format(new Date(symptom.date), 'MMMM d, yyyy')} at {symptom.time || '—'}
                          </span>
                        </div>
                        {symptom.duration ? <span>Duration: {symptom.duration}</span> : null}
                      </div>
                      <div className="border-t border-garden-sage-200/65 pt-4">
                        <h4 className="text-sm font-semibold text-garden-wood mb-2">Symptoms</h4>
                        <p className="text-garden-wood/80 mb-3">{symptom.symptoms}</p>
                        {symptom.triggers ? (
                          <>
                            <h4 className="text-sm font-semibold text-garden-wood mb-2">Possible Triggers</h4>
                            <p className="text-garden-wood/80 mb-3">{symptom.triggers}</p>
                          </>
                        ) : null}
                        {symptom.notes ? (
                          <>
                            <h4 className="text-sm font-semibold text-garden-wood mb-2">Additional Notes</h4>
                            <p className="text-garden-wood/80">{symptom.notes}</p>
                          </>
                        ) : null}
                      </div>
                      <p className="text-sm text-garden-wood/60 mt-4">
                        Recorded by {symptom.recordedBy || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
