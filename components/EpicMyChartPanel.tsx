'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, CheckCircle2 } from 'lucide-react'

type Resident = { id: string; full_name: string }

type EpicMyChartPanelProps = {
  autoImport?: boolean
  onImportComplete?: () => void
}

export function EpicMyChartPanel({ autoImport, onImportComplete }: EpicMyChartPanelProps) {
  const [residents, setResidents] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState('')
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [pendingImport, setPendingImport] = useState(autoImport)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (url.searchParams.get('epic') === 'importing') {
      url.searchParams.delete('epic')
      window.history.replaceState({}, '', url.pathname + url.search)
      setPendingImport(true)
    }
  }, [])

  useEffect(() => {
    void fetch('/api/residents', { credentials: 'same-origin' })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setResidents(data)
      })
      .catch(() => undefined)

    void fetch('/api/sync/epic/status', { credentials: 'same-origin' })
      .then(async (res) => {
        const data = (await res.json()) as { connected?: boolean }
        if (data.connected) setConnected(true)
      })
      .catch(() => undefined)
  }, [])

  const runImport = useCallback(async () => {
    if (!residentId) {
      setMessage('Select who this MyChart data is for first.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/sync/epic/import', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resident_id: residentId }),
      })
      const data = (await res.json()) as {
        error?: string
        medications?: { imported?: number }
        appointments?: { imported?: number }
      }
      if (!res.ok) {
        setMessage(data.error ?? 'MyChart import failed.')
        return
      }
      const meds = data.medications?.imported ?? 0
      const appts = data.appointments?.imported ?? 0
      setMessage(`Imported ${meds} medication(s) and ${appts} appointment(s) from MyChart.`)
      onImportComplete?.()
    } catch {
      setMessage('Network error.')
    } finally {
      setLoading(false)
    }
  }, [residentId, onImportComplete])

  useEffect(() => {
    if ((autoImport || pendingImport) && connected && residentId) {
      void runImport()
      setPendingImport(false)
    }
  }, [autoImport, pendingImport, connected, residentId, runImport])

  return (
    <div className="border border-garden-sage-200/65 bg-white mb-6 p-5 rounded-sm">
      <h2 className="text-lg font-semibold text-garden-wood mb-1">MyChart / Epic</h2>
      <p className="text-sm text-garden-wood/65 mb-4">
        Connect your patient portal to import medications and appointments. Your clinic must support Epic MyChart.
      </p>

      {residents.length > 0 ? (
        <div className="mb-4">
          <label htmlFor="epic-resident" className="block text-sm font-medium text-garden-wood mb-1">
            Who is this health data for?
          </label>
          <select
            id="epic-resident"
            value={residentId}
            onChange={(e) => setResidentId(e.target.value)}
            className="w-full max-w-md border border-garden-clay-200/85 px-3 py-2.5 text-garden-wood min-h-[44px]"
          >
            <option value="">Select…</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.full_name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-sm text-garden-wood mb-4">
          <Link href="/residents/new" className="font-semibold text-care-primary underline underline-offset-2">
            Add a resident profile
          </Link>{' '}
          first.
        </p>
      )}

      {!connected ? (
        <a
          href="/api/sync/epic/connect"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 min-h-[44px]"
        >
          Connect MyChart
        </a>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-garden-wood">
            <CheckCircle2 size={16} className="text-care-primary" aria-hidden />
            Connected
          </span>
          <button
            type="button"
            onClick={() => void runImport()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-garden-clay-200/85 text-garden-wood text-sm font-medium hover:bg-garden-sage-50/70 min-h-[44px]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden />
            {loading ? 'Importing…' : 'Import now'}
          </button>
        </div>
      )}

      {message ? (
        <p className="mt-3 text-sm text-garden-wood" role="status">
          {message}
        </p>
      ) : null}
    </div>
  )
}
