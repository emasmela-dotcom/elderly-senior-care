'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import { loadProtectedList } from '@/lib/loadProtectedList'

type Caregiver = {
  id: string
  full_name: string
  role_name: string | null
  email: string | null
  notes: string | null
}

export default function CaregiversPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const { items, error } = await loadProtectedList<Caregiver>('/api/caregivers')
      setLoadError(error)
      setCaregivers(items)
    } catch {
      setLoadError('Network error')
      setCaregivers([])
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
          <h1 className="text-3xl font-bold text-garden-wood">Caregivers</h1>
          <p className="text-garden-wood/75 mt-1">Manage staff and caregiver information</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="caregivers.json" data={{ caregivers }} />
          <Link
            href="/caregivers/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add New Caregiver
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
              placeholder="Search caregivers by name, role, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-garden-clay-200/85 text-garden-wood placeholder:text-garden-wood/60 focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
              aria-label="Search caregivers"
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
      ) : caregivers.length === 0 ? (
        <div className="bg-white border border-garden-sage-200/65 p-12 text-center">
          <div className="text-garden-wood/45 mb-4" aria-hidden>
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-garden-wood mb-2">No caregivers yet</h2>
          <p className="text-garden-wood/75 mb-4">Get started by adding your first caregiver.</p>
          <Link
            href="/caregivers/new"
            className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Add New Caregiver
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caregivers.map((c) => (
            <div key={c.id} className="bg-white border border-garden-sage-200/65 p-6">
              <h2 className="text-xl font-semibold text-garden-wood mb-1">{c.full_name}</h2>
              {c.role_name ? <p className="text-sm text-garden-wood/80 mb-1">{c.role_name}</p> : null}
              {c.email ? (
                <p className="text-sm text-garden-wood/80 mb-2">
                  <a href={`mailto:${c.email}`} className="text-garden-sage-800 hover:text-garden-sage-900">
                    {c.email}
                  </a>
                </p>
              ) : null}
              {c.notes ? <p className="text-sm text-garden-wood/80 line-clamp-3">{c.notes}</p> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
