'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { RefreshCw, CheckCircle2 } from 'lucide-react'
import { SyncFileUpload } from '@/components/SyncFileUpload'

type Resident = { id: string; full_name: string }

type VitalsImportPanelProps = {
  autoImportFit?: boolean
  onImportComplete?: () => void
}

export function VitalsImportPanel({
  autoImportFit,
  onImportComplete,
}: VitalsImportPanelProps) {
  const [residents, setResidents] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState('')
  const [fitConnected, setFitConnected] = useState(false)
  const [fitLoading, setFitLoading] = useState(false)
  const [fitMessage, setFitMessage] = useState('')
  const [pendingFitImport, setPendingFitImport] = useState(autoImportFit)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (url.searchParams.get('gfit') === 'importing') {
      url.searchParams.delete('gfit')
      window.history.replaceState({}, '', url.pathname + url.search)
      setPendingFitImport(true)
    }
  }, [])

  useEffect(() => {
    void fetch('/api/residents', { credentials: 'same-origin' })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setResidents(data)
      })
      .catch(() => undefined)

    void fetch('/api/sync/google-fit/status', { credentials: 'same-origin' })
      .then(async (res) => {
        const data = (await res.json()) as { connected?: boolean }
        if (data.connected) setFitConnected(true)
      })
      .catch(() => undefined)
  }, [])

  const runFitImport = useCallback(async () => {
    if (!residentId) {
      setFitMessage('Select who these vitals are for first.')
      return
    }
    setFitLoading(true)
    setFitMessage('')
    try {
      const res = await fetch('/api/sync/google-fit/import', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resident_id: residentId }),
      })
      const data = (await res.json()) as { error?: string; imported?: number }
      if (!res.ok) {
        setFitMessage(data.error ?? 'Google Fit import failed.')
        return
      }
      setFitMessage(`Imported ${data.imported ?? 0} day(s) of vitals from Google Fit.`)
      onImportComplete?.()
    } catch {
      setFitMessage('Network error.')
    } finally {
      setFitLoading(false)
    }
  }, [residentId, onImportComplete])

  useEffect(() => {
    if ((autoImportFit || pendingFitImport) && fitConnected && residentId) {
      void runFitImport()
      setPendingFitImport(false)
    }
  }, [autoImportFit, pendingFitImport, fitConnected, residentId, runFitImport])

  return (
    <div className="border border-garden-sage-200/65 bg-white mb-6 p-5 rounded-sm">
      <h2 className="text-lg font-semibold text-garden-wood mb-1">Import health vitals</h2>
      <p className="text-sm text-garden-wood/65 mb-4">
        Bring in vitals you already track from Apple Health or Google Fit.
      </p>

      {residents.length > 0 ? (
        <div className="mb-4">
          <label htmlFor="vitals-resident" className="block text-sm font-medium text-garden-wood mb-1">
            Who are these vitals for?
          </label>
          <select
            id="vitals-resident"
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

      <SyncFileUpload
        title="Apple Health"
        description="On iPhone: Health → profile → Export All Health Data → unzip → upload export.xml here."
        accept=".xml,text/xml"
        uploadUrl="/api/sync/health-vitals"
        residentId={residentId}
        requireResident
        onComplete={() => onImportComplete?.()}
      />

      <section className="border-t border-garden-sage-200/40 pt-5 mt-5">
        <h3 className="text-sm font-semibold text-garden-wood mb-1">Google Fit</h3>
        <p className="text-sm text-garden-wood/65 mb-3">
          Connect Google Fit to import heart rate, blood pressure, weight, and glucose (last 90 days).
        </p>
        {!fitConnected ? (
          <a
            href="/api/sync/google-fit/connect"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 min-h-[44px]"
          >
            Connect Google Fit
          </a>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm text-garden-wood">
              <CheckCircle2 size={16} className="text-care-primary" aria-hidden />
              Connected
            </span>
            <button
              type="button"
              onClick={() => void runFitImport()}
              disabled={fitLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-garden-clay-200/85 text-garden-wood text-sm font-medium hover:bg-garden-sage-50/70 min-h-[44px]"
            >
              <RefreshCw size={14} className={fitLoading ? 'animate-spin' : ''} aria-hidden />
              {fitLoading ? 'Importing…' : 'Import now'}
            </button>
          </div>
        )}
        {fitMessage ? (
          <p className="mt-3 text-sm text-garden-wood" role="status">
            {fitMessage}
          </p>
        ) : null}
      </section>
    </div>
  )
}
