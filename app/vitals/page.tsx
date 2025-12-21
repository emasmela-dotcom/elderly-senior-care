'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Heart, Activity, Scale, Droplet } from 'lucide-react'

interface VitalSign {
  id: string
  residentId: string
  residentName: string
  date: string
  time: string
  bloodPressure?: { systolic: number; diastolic: number }
  heartRate?: number
  temperature?: number
  weight?: number
  glucose?: number
  recordedBy: string
}

export default function VitalsPage() {
  const [vitals] = useState<VitalSign[]>([])
  const [selectedMetric, setSelectedMetric] = useState<'bloodPressure' | 'heartRate' | 'weight' | 'glucose'>('bloodPressure')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vital Signs Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor blood pressure, weight, glucose, and other vital signs with charts</p>
        </div>
        <Link
          href="/vitals/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Record Vitals
        </Link>
      </div>

      {vitals.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vital signs recorded yet</h3>
          <p className="text-gray-600 mb-4">Start tracking vital signs to monitor health trends over time.</p>
          <Link
            href="/vitals/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Record Vitals
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">View Charts</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('bloodPressure')}
                className={`px-4 py-2 text-sm border ${
                  selectedMetric === 'bloodPressure'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Blood Pressure
              </button>
              <button
                onClick={() => setSelectedMetric('heartRate')}
                className={`px-4 py-2 text-sm border ${
                  selectedMetric === 'heartRate'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Heart Rate
              </button>
              <button
                onClick={() => setSelectedMetric('weight')}
                className={`px-4 py-2 text-sm border ${
                  selectedMetric === 'weight'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Weight
              </button>
              <button
                onClick={() => setSelectedMetric('glucose')}
                className={`px-4 py-2 text-sm border ${
                  selectedMetric === 'glucose'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Glucose
              </button>
            </div>
            <div className="mt-6 h-64 border border-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Chart visualization will appear here</p>
            </div>
          </div>

          <div className="space-y-4">
            {vitals.map((vital) => (
              <div key={vital.id} className="bg-white border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{vital.residentName}</h3>
                    <p className="text-sm text-gray-600">{vital.date} at {vital.time}</p>
                    <p className="text-sm text-gray-500">Recorded by {vital.recordedBy}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vital.bloodPressure && (
                    <div className="border border-gray-200 p-3">
                      <div className="flex items-center mb-1">
                        <Heart size={16} className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-600">Blood Pressure</span>
                      </div>
                      <div className="text-xl font-semibold text-gray-900">
                        {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                      </div>
                    </div>
                  )}
                  {vital.heartRate && (
                    <div className="border border-gray-200 p-3">
                      <div className="flex items-center mb-1">
                        <Activity size={16} className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-600">Heart Rate</span>
                      </div>
                      <div className="text-xl font-semibold text-gray-900">{vital.heartRate} bpm</div>
                    </div>
                  )}
                  {vital.weight && (
                    <div className="border border-gray-200 p-3">
                      <div className="flex items-center mb-1">
                        <Scale size={16} className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-600">Weight</span>
                      </div>
                      <div className="text-xl font-semibold text-gray-900">{vital.weight} lbs</div>
                    </div>
                  )}
                  {vital.glucose && (
                    <div className="border border-gray-200 p-3">
                      <div className="flex items-center mb-1">
                        <Droplet size={16} className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-600">Glucose</span>
                      </div>
                      <div className="text-xl font-semibold text-gray-900">{vital.glucose} mg/dL</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

