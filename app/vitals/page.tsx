'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Heart,
  Activity,
  Scale,
  Droplet,
} from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface VitalSign {
  id: string
  residentId: string
  residentName: string
  date: string
  time: string
  bloodPressure?: { systolic: number; diastolic: number }
  heartRate?: number
  temperature?: number
  weight?: number
  glucose?: number
  recordedBy: string
}

export default function VitalsPage() {
  const [vitals, setVitals] = useState<VitalSign[]>([])
  const [selectedMetric, setSelectedMetric] = useState<
    'bloodPressure' | 'heartRate' | 'weight' | 'glucose'
  >('bloodPressure')
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/vitals', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load vitals')
        setVitals([])
        return
      }
      setVitals(Array.isArray(data) ? data : [])
    } catch {
      setLoadError('Network error')
      setVitals([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const chartRows = useMemo(() => {
    const withBp = vitals.filter((v) => v.bloodPressure)
    return withBp.map((v, i) => ({
      label: `${v.date} ${v.time}`,
      idx: i + 1,
      systolic: v.bloodPressure!.systolic,
      diastolic: v.bloodPressure!.diastolic,
    }))
  }, [vitals])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-garden-wood">Vital Signs Tracking</h1>
          <p className="text-garden-wood/75 mt-1">
            Monitor blood pressure, weight, glucose, and other vital signs with charts
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="vitals.json" data={{ vitals }} />
          <Link
            href="/vitals/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Record Vitals
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
      ) : vitals.length === 0 ? (
        <div className="bg-white border border-garden-sage-200/65 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-garden-wood/45 mb-4" aria-hidden />
          <h2 className="text-lg font-medium text-garden-wood mb-2">No vital signs recorded yet</h2>
          <p className="text-garden-wood/75 mb-4">Start tracking vital signs to monitor health trends over time.</p>
          <Link
            href="/vitals/new"
            className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Record Vitals
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white border border-garden-sage-200/65 p-6 mb-6">
            <h2 className="text-lg font-semibold text-garden-wood mb-4">Blood pressure trend</h2>
            {chartRows.length > 0 ? (
              <div className="h-72 w-full" role="img" aria-label="Blood pressure line chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartRows} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#C8D9C0" />
                    <XAxis dataKey="idx" tick={{ fill: '#445A3C' }} />
                    <YAxis tick={{ fill: '#445A3C' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid #C8D9C0',
                      }}
                      labelFormatter={(_, p) =>
                        p?.[0]?.payload?.label != null ? String(p[0].payload.label) : ''
                      }
                    />
                    <Legend />
                    <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#557049" strokeWidth={2} dot />
                    <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#A37B66" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-garden-wood/75 text-sm">Add readings with blood pressure to see this chart.</p>
            )}
          </div>

          <div className="bg-white border border-garden-sage-200/65 p-6 mb-6">
            <h2 className="text-lg font-semibold text-garden-wood mb-4">View Charts</h2>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['bloodPressure', 'Blood Pressure'],
                  ['heartRate', 'Heart Rate'],
                  ['weight', 'Weight'],
                  ['glucose', 'Glucose'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedMetric(key)}
                  className={`px-4 py-2 text-sm border ${
                    selectedMetric === key
                      ? 'border-garden-sage-600 text-garden-sage-800 bg-garden-sage-50'
                      : 'border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-6 h-40 border border-garden-sage-200/65 flex items-center justify-center text-garden-wood/75 text-sm">
              {selectedMetric === 'bloodPressure'
                ? 'Use the chart above for blood pressure.'
                : 'Additional metric charts can be added the same way as blood pressure.'}
            </div>
          </div>

          <div className="space-y-4">
            {vitals.map((vital) => (
              <div key={vital.id} className="bg-white border border-garden-sage-200/65 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-garden-wood">{vital.residentName}</h3>
                    <p className="text-sm text-garden-wood/75">
                      {vital.date} at {vital.time}
                    </p>
                    <p className="text-sm text-garden-wood/60">Recorded by {vital.recordedBy || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vital.bloodPressure && (
                    <div className="border border-garden-sage-200/65 p-3">
                      <div className="flex items-center mb-1">
                        <Heart size={16} className="text-garden-wood/80 mr-2" aria-hidden />
                        <span className="text-sm text-garden-wood/80">Blood Pressure</span>
                      </div>
                      <div className="text-xl font-semibold text-garden-wood">
                        {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                      </div>
                    </div>
                  )}
                  {vital.heartRate != null && (
                    <div className="border border-garden-sage-200/65 p-3">
                      <div className="flex items-center mb-1">
                        <Activity size={16} className="text-garden-wood/80 mr-2" aria-hidden />
                        <span className="text-sm text-garden-wood/80">Heart Rate</span>
                      </div>
                      <div className="text-xl font-semibold text-garden-wood">{vital.heartRate} bpm</div>
                    </div>
                  )}
                  {vital.weight != null && (
                    <div className="border border-garden-sage-200/65 p-3">
                      <div className="flex items-center mb-1">
                        <Scale size={16} className="text-garden-wood/80 mr-2" aria-hidden />
                        <span className="text-sm text-garden-wood/80">Weight</span>
                      </div>
                      <div className="text-xl font-semibold text-garden-wood">{vital.weight} lbs</div>
                    </div>
                  )}
                  {vital.glucose != null && (
                    <div className="border border-garden-sage-200/65 p-3">
                      <div className="flex items-center mb-1">
                        <Droplet size={16} className="text-garden-wood/80 mr-2" aria-hidden />
                        <span className="text-sm text-garden-wood/80">Glucose</span>
                      </div>
                      <div className="text-xl font-semibold text-garden-wood">{vital.glucose} mg/dL</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
