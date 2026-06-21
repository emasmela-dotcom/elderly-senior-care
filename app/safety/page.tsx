'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Shield } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import { loadProtectedList } from '@/lib/loadProtectedList'

type Incident = {
  id: string
  title: string
  description: string | null
  severity: string | null
  status: string
  created_at: string
}

export default function SafetyPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const { items, error } = await loadProtectedList<Incident>('/api/incidents')
      setLoadError(error)
      setIncidents(items)
    } catch {
      setLoadError('Network error')
      setIncidents([])
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
          <h1 className="text-3xl font-bold text-garden-wood">Safety & Compliance</h1>
          <p className="text-garden-wood/75 mt-1">Incident reports, safety protocols, and regulatory compliance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="safety-incidents.json" data={{ incidents }} />
          <Link
            href="/safety/incidents/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Report Incident
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
      ) : incidents.length === 0 ? (
        <div className="bg-white border border-garden-sage-200/65 p-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-garden-wood/45 mb-4" aria-hidden />
          <h2 className="text-lg font-medium text-garden-wood mb-2">Safety Dashboard</h2>
          <p className="text-garden-wood/75 mb-4">No incidents reported. Monitor safety incidents and compliance status.</p>
          <Link
            href="/safety/incidents/new"
            className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Report Incident
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {incidents.map((i) => (
            <li key={i.id} className="bg-white border border-garden-sage-200/65 p-4">
              <div className="flex justify-between gap-4 flex-wrap">
                <h2 className="text-lg font-semibold text-garden-wood">{i.title}</h2>
                <span className="text-sm text-garden-wood/80">{i.status}</span>
              </div>
              {i.severity ? <p className="text-sm text-garden-wood/80 mt-1">Severity: {i.severity}</p> : null}
              {i.description ? <p className="text-sm text-garden-wood mt-2">{i.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
