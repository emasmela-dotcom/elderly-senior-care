'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Calendar,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react'

interface SyncResult {
  imported: number
  skipped: number
  total: number
}

interface SyncPanelProps {
  onImportComplete?: () => void
  autoImport?: boolean
}

type Phase =
  | 'disconnected'
  | 'connected'
  | 'importing'
  | 'success'
  | 'error'

export function SyncPanel({ onImportComplete, autoImport }: SyncPanelProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>('disconnected')
  const [result, setResult] = useState<SyncResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [lastSync, setLastSync] = useState<Date | null>(null)

  useEffect(() => {
    if (!session) return
    void fetch('/api/sync/google-calendar/status', { credentials: 'same-origin' })
      .then(async (res) => {
        const data: unknown = await res.json().catch(() => ({}))
        if ((data as { connected?: boolean }).connected) {
          setPhase('connected')
        }
      })
      .catch(() => undefined)
  }, [session])

  useEffect(() => {
    if (!session || !autoImport) return
    setOpen(true)
    setPhase('connected')
    void runImport()
  }, [autoImport, session]) // eslint-disable-line react-hooks/exhaustive-deps

  async function runImport() {
    setPhase('importing')
    setErrorMsg('')
    try {
      const res = await fetch('/api/sync/google-calendar/import', {
        method: 'POST',
        credentials: 'same-origin',
      })
      const data: unknown = await res.json().catch(() => ({}))
      if (!res.ok) {
        setPhase('error')
        setErrorMsg(
          (data as { error?: string }).error ??
            'Something went wrong. Please try again.'
        )
        return
      }
      setResult(data as SyncResult)
      setLastSync(new Date())
      setPhase('success')
      onImportComplete?.()
    } catch {
      setPhase('error')
      setErrorMsg('Network error — check your connection and try again.')
    }
  }

  return (
    <div className="border border-garden-sage-200/65 bg-white mb-6 rounded-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-garden-sage-50/60 transition-colors focus-visible:outline-2 focus-visible:outline-care-primary"
        aria-expanded={open}
        aria-controls="sync-panel-body"
      >
        <div className="flex items-center gap-3">
          <Calendar size={22} className="text-care-primary shrink-0" aria-hidden />
          <div>
            <p className="text-base font-semibold text-garden-wood leading-tight">
              Connect your calendar
            </p>
            <p className="text-sm text-garden-wood/65 mt-0.5">
              We&apos;ll pull in what you already have — no re-typing needed.
            </p>
          </div>
        </div>
        <span aria-hidden>
          {open ? (
            <ChevronUp size={20} className="text-garden-wood/50 shrink-0" />
          ) : (
            <ChevronDown size={20} className="text-garden-wood/50 shrink-0" />
          )}
        </span>
      </button>

      {open && (
        <div
          id="sync-panel-body"
          className="border-t border-garden-sage-200/65 px-5 py-5 space-y-6"
        >
          <section aria-labelledby="gcal-heading">
            <h3
              id="gcal-heading"
              className="text-sm font-semibold text-garden-wood mb-1"
            >
              Google Calendar
            </h3>
            <p className="text-sm text-garden-wood/65 mb-4 leading-relaxed">
              Imports your upcoming appointments (next 90 days). Read-only —
              we never change anything in your Google Calendar.
            </p>

            {phase === 'disconnected' && !session && (
              <p className="text-sm text-garden-wood leading-relaxed">
                <Link
                  href="/login"
                  className="font-semibold text-care-primary underline underline-offset-2"
                >
                  Sign in
                </Link>{' '}
                to connect your Google Calendar.
              </p>
            )}

            {phase === 'disconnected' && session && (
              <a
                href="/api/sync/google-calendar/connect"
                className="inline-flex items-center gap-2 px-5 py-3 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-care-primary focus-visible:outline-offset-2 min-h-[44px]"
              >
                <Calendar size={18} aria-hidden />
                Connect Google Calendar
              </a>
            )}

            {phase === 'connected' && (
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2 text-sm text-garden-wood">
                  <CheckCircle2 size={18} className="text-care-primary" aria-hidden />
                  Connected
                </div>
                <button
                  type="button"
                  onClick={() => void runImport()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 transition-colors min-h-[44px]"
                >
                  <RefreshCw size={16} aria-hidden />
                  Import now
                </button>
              </div>
            )}

            {phase === 'importing' && (
              <div
                className="flex items-center gap-2 text-sm text-garden-wood/70"
                role="status"
                aria-live="polite"
              >
                <RefreshCw size={18} className="animate-spin text-care-primary" aria-hidden />
                Pulling in your appointments…
              </div>
            )}

            {phase === 'success' && (
              <div className="space-y-3">
                <div
                  className="flex items-start gap-2 text-sm text-garden-wood"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2
                    size={20}
                    className="text-care-primary mt-0.5 shrink-0"
                    aria-hidden
                  />
                  <span>
                    <strong>
                      {result?.imported ?? 0} appointment
                      {result?.imported !== 1 ? 's' : ''}
                    </strong>{' '}
                    added
                    {(result?.skipped ?? 0) > 0 &&
                      ` · ${result!.skipped} already here`}
                  </span>
                </div>
                {lastSync && (
                  <p className="flex items-center gap-1 text-xs text-garden-wood/50">
                    <Clock size={12} aria-hidden />
                    Last synced{' '}
                    {lastSync.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => void runImport()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-garden-clay-200/85 text-garden-wood text-sm font-medium hover:bg-garden-sage-50/70 transition-colors min-h-[44px]"
                >
                  <RefreshCw size={14} aria-hidden />
                  Refresh now
                </button>
              </div>
            )}

            {phase === 'error' && (
              <div className="space-y-3">
                <div
                  className="flex items-start gap-2 text-sm text-red-700"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
                  <span>{errorMsg}</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="/api/sync/google-calendar/connect"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-care-primary text-white text-sm font-semibold hover:bg-care-primary/90 transition-colors min-h-[44px]"
                  >
                    Reconnect
                  </a>
                  <button
                    type="button"
                    onClick={() => void runImport()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-garden-clay-200/85 text-garden-wood text-sm font-medium hover:bg-garden-sage-50/70 transition-colors min-h-[44px]"
                  >
                    Try import again
                  </button>
                </div>
              </div>
            )}
          </section>

          <p className="text-xs text-garden-wood/55 leading-relaxed border-t border-garden-sage-200/40 pt-4">
            You can also add appointments manually with Schedule Appointment above.
          </p>
        </div>
      )}
    </div>
  )
}
