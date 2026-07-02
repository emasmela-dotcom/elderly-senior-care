'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react'

type SyncFileUploadProps = {
  title: string
  description: string
  accept: string
  uploadUrl: string
  fileFieldName?: string
  residentId?: string
  requireResident?: boolean
  onComplete?: (result: { imported?: number; skipped?: number; total?: number }) => void
}

export function SyncFileUpload({
  title,
  description,
  accept,
  uploadUrl,
  fileFieldName = 'file',
  residentId,
  requireResident,
  onComplete,
}: SyncFileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleUpload() {
    if (!file) {
      setError('Choose a file first.')
      return
    }
    if (requireResident && !residentId) {
      setError('Select who this is for first.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const form = new FormData()
      form.set(fileFieldName, file)
      if (residentId) form.set('resident_id', residentId)

      const res = await fetch(uploadUrl, {
        method: 'POST',
        credentials: 'same-origin',
        body: form,
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        imported?: number
        skipped?: number
        total?: number
        medications?: { imported?: number }
        appointments?: { imported?: number }
      }

      if (!res.ok) {
        setError(data.error ?? 'Import failed.')
        return
      }

      const imported =
        data.imported ??
        (data.medications?.imported ?? 0) + (data.appointments?.imported ?? 0)
      const total = data.total ?? imported
      setSuccess(
        imported > 0
          ? `Imported ${imported} item${imported === 1 ? '' : 's'}.`
          : 'Nothing new to import — those items may already be here.'
      )
      onComplete?.(data)
      setFile(null)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="border-t border-garden-sage-200/40 pt-5">
      <h3 className="text-sm font-semibold text-garden-wood mb-1">{title}</h3>
      <p className="text-sm text-garden-wood/65 mb-3 leading-relaxed">{description}</p>

      {!residentId && requireResident ? (
        <p className="text-sm text-garden-wood mb-3">
          <Link href="/login" className="font-semibold text-care-primary underline underline-offset-2">
            Sign in
          </Link>{' '}
          and add a resident profile first.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm text-garden-wood file:mr-3 file:rounded-garden file:border file:border-garden-clay-200/85 file:bg-white file:px-3 file:py-2 file:text-sm file:text-garden-wood"
        />
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 disabled:opacity-60 min-h-[44px]"
        >
          <Upload size={16} aria-hidden />
          {loading ? 'Importing…' : 'Import'}
        </button>
      </div>

      {success ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-garden-wood" role="status">
          <CheckCircle2 size={16} className="text-care-primary shrink-0" aria-hidden />
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-red-700" role="alert">
          <AlertCircle size={16} className="shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </section>
  )
}
