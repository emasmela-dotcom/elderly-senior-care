'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import { SyncPanel } from '@/components/SyncPanel'
import { format } from 'date-fns'
import { loadProtectedList } from '@/lib/loadProtectedList'

interface ChecklistItem {
  id?: string
  text: string
  completed: boolean
}

interface Appointment {
  id: string
  residentId: string
  residentName: string
  type: string
  doctorName: string
  date: string
  time: string
  location?: string
  address?: string
  notes?: string
  checklist: ChecklistItem[]
}

function stripGcalTag(text: string | undefined): string {
  if (!text) return ''
  return text.replace(/\s*\[gcal:[^\]]+\]/g, '').trim()
}

function AppointmentsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const autoImport = searchParams.get('sync') === 'importing'

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const { items, error } = await loadProtectedList<Appointment>('/api/appointments')
      setLoadError(error)
      setAppointments(items)
    } catch {
      setLoadError('Network error')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (autoImport) {
      const url = new URL(window.location.href)
      url.searchParams.delete('sync')
      router.replace(url.pathname + (url.search || ''), { scroll: false })
    }
  }, [autoImport, router])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = appointments.filter((apt) => {
    const d = new Date(apt.date)
    d.setHours(0, 0, 0, 0)
    return d >= today
  })

  const past = appointments.filter((apt) => {
    const d = new Date(apt.date)
    d.setHours(0, 0, 0, 0)
    return d < today
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-garden-wood">
            Appointment Management
          </h1>
          <p className="text-garden-wood/75 mt-1">
            Manage doctor visits with prep checklists and reminders
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="appointments.json" data={{ appointments }} />
          <Link
            href="/appointments/new"
            className="flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors min-h-[44px]"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Schedule Appointment
          </Link>
        </div>
      </div>

      <SyncPanel autoImport={autoImport} onImportComplete={() => void load()} />

      {loading ? (
        <p className="text-garden-wood/60 text-sm py-8 text-center">
          Loading appointments…
        </p>
      ) : loadError ? (
        <p className="text-sm text-red-700 py-4" role="alert">
          {loadError}
        </p>
      ) : appointments.length === 0 ? (
        <div className="bg-white border border-garden-sage-200/65 p-12 text-center">
          <Calendar
            className="mx-auto h-12 w-12 text-garden-wood/45 mb-4"
            aria-hidden
          />
          <h3 className="text-lg font-medium text-garden-wood mb-2">
            No appointments scheduled
          </h3>
          <p className="text-garden-wood/75 mb-4">
            Schedule appointments manually or connect your calendar above to
            pull them in automatically.
          </p>
          <Link
            href="/appointments/new"
            className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
          >
            <Plus size={20} className="mr-2" aria-hidden />
            Schedule Appointment
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-garden-wood mb-4">
                Upcoming Appointments
              </h2>
              <div className="space-y-4">
                {upcoming.map((apt) => {
                  const displayType = stripGcalTag(apt.type)
                  const displayNotes = stripGcalTag(apt.notes)
                  return (
                    <article
                      key={apt.id}
                      className="bg-white border border-garden-sage-200/65 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-garden-wood">
                              {displayType || apt.type}
                            </h3>
                            {apt.doctorName && (
                              <span className="text-sm text-garden-wood/75">
                                with {apt.doctorName}
                              </span>
                            )}
                          </div>
                          {apt.residentName && (
                            <p className="text-lg font-medium text-garden-wood mb-1">
                              {apt.residentName}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-garden-wood/75 mb-4">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-1" aria-hidden />
                              <span>
                                {format(new Date(apt.date), 'MMMM d, yyyy')}
                              </span>
                            </div>
                            {apt.time && (
                              <div className="flex items-center">
                                <Clock size={16} className="mr-1" aria-hidden />
                                <span>{apt.time}</span>
                              </div>
                            )}
                            {apt.location && (
                              <div className="flex items-center">
                                <MapPin size={16} className="mr-1" aria-hidden />
                                <span>{apt.location}</span>
                              </div>
                            )}
                          </div>

                          {apt.checklist && apt.checklist.length > 0 && (
                            <div className="border-t border-garden-sage-200/65 pt-4">
                              <h4 className="text-sm font-semibold text-garden-wood mb-3 flex items-center">
                                <FileText size={16} className="mr-2" aria-hidden />
                                Preparation Checklist
                              </h4>
                              <ul className="space-y-2">
                                {apt.checklist.map((item, idx) => (
                                  <li
                                    key={item.id ?? idx}
                                    className="flex items-center"
                                  >
                                    <CheckCircle2
                                      size={18}
                                      className={`mr-2 ${
                                        item.completed
                                          ? 'text-garden-wood/80'
                                          : 'text-garden-sage-300'
                                      }`}
                                      aria-hidden
                                    />
                                    <span
                                      className={`text-sm ${
                                        item.completed
                                          ? 'text-garden-wood/75 line-through'
                                          : 'text-garden-wood'
                                      }`}
                                    >
                                      {item.text}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {displayNotes && (
                            <div className="mt-4 pt-4 border-t border-garden-sage-200/65">
                              <p className="text-sm text-garden-wood/75">
                                {displayNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-garden-wood mb-4">
                Past Appointments
              </h2>
              <div className="space-y-4">
                {past.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white border border-garden-sage-200/65 p-6 opacity-75"
                  >
                    <h3 className="text-lg font-semibold text-garden-wood">
                      {stripGcalTag(apt.type) || apt.type}
                    </h3>
                    <p className="text-sm text-garden-wood/75">
                      {[apt.residentName, apt.doctorName]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    <p className="text-sm text-garden-wood/60 mt-1">
                      {format(new Date(apt.date), 'MMMM d, yyyy')}
                      {apt.time ? ` at ${apt.time}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <p className="text-garden-wood/60 text-sm py-8 text-center">
            Loading appointments…
          </p>
        </div>
      }
    >
      <AppointmentsPageContent />
    </Suspense>
  )
}
