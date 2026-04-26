'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'

type Schedule = {
  id: string
  title: string
  description: string | null
  schedule_type: string | null
  start_date: string | null
  end_date: string | null
}

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/schedules', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load schedules')
        setSchedules([])
        return
      }
      setSchedules(Array.isArray(data) ? data : [])
    } catch {
      setLoadError('Network error')
      setSchedules([])
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
          <h1 className="text-3xl font-bold text-garden-wood">Care Schedules</h1>
          <p className="text-garden-wood/75 mt-1">
            Manage medication schedules, appointments, and daily care routines
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="schedules.json" data={{ schedules }} />
          <Link
            href="/schedules/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Create Schedule
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
      ) : schedules.length === 0 ? (
        <div className="bg-white border border-garden-sage-200/65 p-8 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-garden-wood/45 mb-4" aria-hidden />
          <h2 className="text-lg font-medium text-garden-wood mb-2">No schedules yet</h2>
          <p className="text-garden-wood/75 mb-4">Create schedules for medications, appointments, and care activities.</p>
          <Link
            href="/schedules/new"
            className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Create Schedule
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {schedules.map((s) => (
            <li key={s.id} className="bg-white border border-garden-sage-200/65 p-4">
              <h2 className="text-lg font-semibold text-garden-wood">{s.title}</h2>
              {s.description ? <p className="text-sm text-garden-wood/80 mt-1">{s.description}</p> : null}
              <p className="text-sm text-garden-wood/75 mt-2">
                {s.schedule_type ?? '—'} {s.start_date ? `· ${s.start_date}` : ''}{' '}
                {s.end_date ? `– ${s.end_date}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
