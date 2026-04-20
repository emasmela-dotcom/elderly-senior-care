'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Activity } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'

type Row = { id: string; title: string; description: string | null; activity_date: string | null }

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Row[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/activities', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load activities')
        setActivities([])
        return
      }
      setActivities(Array.isArray(data) ? data : [])
    } catch {
      setLoadError('Network error')
      setActivities([])
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
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">Monitor daily activities and engagement programs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="activities.json" data={{ activities }} />
          <Link
            href="/activities/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add Activity
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
      ) : activities.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden />
          <h2 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h2>
          <p className="text-gray-600 mb-4">Create activity programs to engage residents.</p>
          <Link
            href="/activities/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add Activity
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {activities.map((a) => (
            <li key={a.id} className="bg-white border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">{a.title}</h2>
              {a.description ? <p className="text-sm text-gray-700 mt-1">{a.description}</p> : null}
              {a.activity_date ? (
                <p className="text-sm text-gray-600 mt-2">Date: {a.activity_date}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
