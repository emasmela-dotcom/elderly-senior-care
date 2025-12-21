'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pill, Clock, Calendar, Image as ImageIcon } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  residentId: string
  residentName: string
  photoUrl?: string
  startDate: string
  endDate?: string
  notes?: string
}

export default function MedicationsPage() {
  const [medications] = useState<Medication[]>([])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medication Reminders</h1>
          <p className="text-gray-600 mt-1">Manage medications with visual pill identification and reminders</p>
        </div>
        <Link
          href="/medications/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Medication
        </Link>
      </div>

      {medications.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h3>
          <p className="text-gray-600 mb-4">Add medications to set up reminders with pill photos.</p>
          <Link
            href="/medications/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Medication
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map((med) => (
            <div key={med.id} className="bg-white border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {med.photoUrl ? (
                    <img 
                      src={med.photoUrl} 
                      alt={med.name}
                      className="w-16 h-16 object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-16 h-16 border border-gray-300 flex items-center justify-center bg-gray-50">
                      <ImageIcon className="text-gray-400" size={24} />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{med.name}</h3>
                      <span className="text-sm text-gray-600">{med.dosage}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{med.residentName}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{med.frequency}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        <span>{med.times.join(', ')}</span>
                      </div>
                    </div>
                    {med.notes && (
                      <p className="text-sm text-gray-600 mt-2">{med.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/medications/${med.id}/edit`}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

