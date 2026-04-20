'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Calendar, Clock, MapPin, FileText, CheckCircle2 } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import { format } from 'date-fns'

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

interface ChecklistItem {
  id?: string
  text: string
  completed: boolean
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/appointments', { credentials: 'same-origin' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoadError((data as { error?: string }).error || 'Could not load appointments')
        setAppointments([])
        return
      }
      setAppointments(Array.isArray(data) ? data : [])
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
          <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600 mt-1">Manage doctor visits with prep checklists and reminders</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DownloadJsonButton filename="appointments.json" data={{ appointments }} />
          <Link
            href="/appointments/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Schedule Appointment
          </Link>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-600 mb-4">Schedule appointments and create prep checklists.</p>
          <Link
            href="/appointments/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Schedule Appointment
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {upcoming.map((apt) => (
                  <div key={apt.id} className="bg-white border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{apt.type}</h3>
                          <span className="text-sm text-gray-600">with {apt.doctorName}</span>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-1">{apt.residentName}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            <span>{format(new Date(apt.date), 'MMMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            <span>{apt.time}</span>
                          </div>
                          {apt.location && (
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-1" />
                              <span>{apt.location}</span>
                            </div>
                          )}
                        </div>
                        {apt.checklist && apt.checklist.length > 0 && (
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <FileText size={16} className="mr-2" />
                              Preparation Checklist
                            </h4>
                            <div className="space-y-2">
                              {apt.checklist.map((item, idx) => (
                                <div key={item.id ?? idx} className="flex items-center">
                                  <CheckCircle2
                                    size={18}
                                    className={`mr-2 ${
                                      item.completed ? 'text-gray-700' : 'text-gray-300'
                                    }`}
                                  />
                                  <span
                                    className={`text-sm ${
                                      item.completed ? 'text-gray-600 line-through' : 'text-gray-900'
                                    }`}
                                  >
                                    {item.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {apt.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">{apt.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Appointments</h2>
              <div className="space-y-4">
                {past.map((apt) => (
                  <div key={apt.id} className="bg-white border border-gray-200 p-6 opacity-75">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{apt.type}</h3>
                        <p className="text-sm text-gray-600">{apt.residentName} • {apt.doctorName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(apt.date), 'MMMM d, yyyy')} at {apt.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

