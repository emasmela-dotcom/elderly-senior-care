'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SyncFileUpload } from '@/components/SyncFileUpload'

type Resident = { id: string; full_name: string }

type PharmacyImportPanelProps = {
  onImportComplete?: () => void
}

export function PharmacyImportPanel({ onImportComplete }: PharmacyImportPanelProps) {
  const [residents, setResidents] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState('')

  useEffect(() => {
    void fetch('/api/residents', { credentials: 'same-origin' })
      .then(async (res) => {
        const data = await res.json()
        if (res.ok && Array.isArray(data)) setResidents(data)
      })
      .catch(() => undefined)
  }, [])

  return (
    <div className="border border-garden-sage-200/65 bg-white mb-6 p-5 rounded-sm">
      <h2 className="text-lg font-semibold text-garden-wood mb-1">Import from pharmacy</h2>
      <p className="text-sm text-garden-wood/65 mb-4">
        Export your prescription list from CVS, Walgreens, or your pharmacy portal as CSV, then upload it here.
      </p>

      {residents.length > 0 ? (
        <div className="mb-4">
          <label htmlFor="pharmacy-resident" className="block text-sm font-medium text-garden-wood mb-1">
            Who are these medications for?
          </label>
          <select
            id="pharmacy-resident"
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
          first, then import prescriptions.
        </p>
      )}

      <SyncFileUpload
        title="Pharmacy CSV file"
        description="CSV should include a Drug or Medication column."
        accept=".csv,text/csv"
        uploadUrl="/api/sync/pharmacy"
        residentId={residentId}
        requireResident
        onComplete={() => onImportComplete?.()}
      />
    </div>
  )
}
