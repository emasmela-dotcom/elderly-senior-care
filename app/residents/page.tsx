'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import { ExportCsvButton } from '@/components/ExportCsvButton'
import { ExportResidentsPdfButton } from '@/components/ExportPdfButton'

type ResidentRow = {
  id: string
  full_name: string
  room_number: string | null
  notes: string | null
  created_at: string
}

export default function ResidentsPage() {
  const [residents, setResidents] = useState<ResidentRow[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/residents', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load residents')
        setResidents([])
        return
      }
      setResidents(Array.isArray(data) ? data : [])
    } catch {
      setLoadError('Network error')
      setResidents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const csvRows = residents.map((r) => [
    r.id,
    r.full_name,
    r.room_number ?? '',
    r.notes ?? '',
    r.created_at,
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-garden-wood">Residents</h1>
          <p className="text-garden-wood/75 mt-1">Manage resident profiles and information</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="residents.json" data={{ residents }} />
          <ExportCsvButton
            filename="residents.csv"
            headers={['id', 'full_name', 'room_number', 'notes', 'created_at']}
            rows={csvRows}
          />
          <ExportResidentsPdfButton residents={residents} />
          <Link
            href="/residents/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add New Resident
          </Link>
        </div>
      </div>

      {loadError ? (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 text-red-900 text-sm" role="alert">
          {loadError}
        </div>
      ) : null}

      <div className="bg-white border border-garden-sage-200/65 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-garden-wood/60"
              size={20}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search residents by name, room number, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-garden-clay-200/85 text-garden-wood placeholder:text-garden-wood/60 focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
              aria-label="Search residents"
            />
          </div>
          <button
            type="button"
            className="flex items-center px-4 py-2 border border-garden-clay-200/85 text-garden-wood hover:bg-garden-sage-50/70"
          >
            <Filter size={20} className="mr-2" aria-hidden />
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-garden-wood/75">Loading…</p>
      ) : residents.length === 0 ? (
        <div className="bg-white border border-garden-sage-200/65 p-12 text-center">
          <div className="text-garden-wood/45 mb-4" aria-hidden>
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-garden-wood mb-2">No residents yet</h2>
          <p className="text-garden-wood/75 mb-4">Get started by adding your first resident.</p>
          <Link
            href="/residents/new"
            className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add New Resident
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {residents.map((r) => (
            <div key={r.id} className="bg-white border border-garden-sage-200/65 p-6">
              <h2 className="text-xl font-semibold text-garden-wood mb-1">{r.full_name}</h2>
              {r.room_number ? (
                <p className="text-sm text-garden-wood/75 mb-2">Room {r.room_number}</p>
              ) : null}
              {r.notes ? (
                <p className="text-sm text-garden-wood/80 mb-4 line-clamp-3">{r.notes}</p>
              ) : null}
              <Link
                href={`/residents/${r.id}/edit`}
                className="text-sm text-garden-sage-800 hover:text-garden-sage-900 font-medium"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
