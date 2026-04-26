'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'

type Row = {
  id: string
  title: string
  content: string | null
  record_type: string | null
  resident_name: string | null
}

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<Row[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/health-records', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load records')
        setRecords([])
        return
      }
      setRecords(Array.isArray(data) ? data : [])
    } catch {
      setLoadError('Network error')
      setRecords([])
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
          <h1 className="text-3xl font-bold text-garden-wood">Health Records</h1>
          <p className="text-garden-wood/75 mt-1">Track medical history, medications, and vital signs</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="health-records.json" data={{ records }} />
          <Link
            href="/health-records/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add Health Record
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
      ) : records.length === 0 ? (
        <div className="bg-white border border-garden-sage-200/65 p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-garden-wood/45 mb-4" aria-hidden />
          <h2 className="text-lg font-medium text-garden-wood mb-2">No health records yet</h2>
          <p className="text-garden-wood/75 mb-4">Start tracking health information for residents.</p>
          <Link
            href="/health-records/new"
            className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add Health Record
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {records.map((r) => (
            <li key={r.id} className="bg-white border border-garden-sage-200/65 p-4">
              <h2 className="text-lg font-semibold text-garden-wood">{r.title}</h2>
              <p className="text-sm text-garden-wood/75 mt-1">
                {r.resident_name ?? 'No resident'} {r.record_type ? `· ${r.record_type}` : ''}
              </p>
              {r.content ? <p className="text-sm text-garden-wood mt-2 line-clamp-4">{r.content}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
