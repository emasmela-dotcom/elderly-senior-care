'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Heart,
  Pill,
  Activity,
  Bell
} from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'
import { format } from 'date-fns'

export default function CaregiverMobilePage() {
  const [selectedDate] = useState(new Date())
  
  // Mock data - replace with actual data fetching
  const todayTasks = [
    { id: 1, time: '08:00', resident: 'John Doe', task: 'Morning Medication', status: 'pending', type: 'medication' },
    { id: 2, time: '09:30', resident: 'Jane Smith', task: 'Vital Signs Check', status: 'completed', type: 'health' },
    { id: 3, time: '12:00', resident: 'John Doe', task: 'Lunch Assistance', status: 'pending', type: 'care' },
    { id: 4, time: '14:00', resident: 'Jane Smith', task: 'Afternoon Medication', status: 'pending', type: 'medication' },
    { id: 5, time: '16:00', resident: 'John Doe', task: 'Activity Participation', status: 'pending', type: 'activity' },
  ]

  const urgentAlerts = [
    { id: 1, resident: 'John Doe', message: 'Medication reminder overdue', priority: 'high' },
  ]

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'medication': return Pill
      case 'health': return Heart
      case 'activity': return Activity
      default: return CheckCircle2
    }
  }

  const getTaskColor = (type: string) => {
    return 'bg-gray-100 text-gray-700 border border-gray-300'
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Caregiver Dashboard</h1>
            <p className="text-sm text-gray-300">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <DownloadJsonButton
              variant="dark"
              filename="caregiver-mobile.json"
              data={{
                date: selectedDate.toISOString(),
                todayTasks,
                urgentAlerts,
              }}
            />
            <Bell size={24} className="text-white" aria-hidden />
          </div>
        </div>
      </div>

      {/* Urgent Alerts */}
      {urgentAlerts.length > 0 && (
        <div className="mx-4 mt-4">
          <div className="bg-white border-l-4 border-gray-900 p-4">
            <div className="flex items-center">
              <AlertCircle className="text-gray-700 mr-2" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Urgent Alerts</h3>
                {urgentAlerts.map((alert) => (
                  <p key={alert.id} className="text-sm text-gray-700 mt-1">
                    {alert.resident}: {alert.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mx-4 mt-4">
        <div className="bg-white border border-gray-200 p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{todayTasks.filter(t => t.status === 'pending').length}</div>
          <div className="text-xs text-gray-600 mt-1">Pending</div>
        </div>
        <div className="bg-white border border-gray-200 p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{todayTasks.filter(t => t.status === 'completed').length}</div>
          <div className="text-xs text-gray-600 mt-1">Completed</div>
        </div>
        <div className="bg-white border border-gray-200 p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{todayTasks.length}</div>
          <div className="text-xs text-gray-600 mt-1">Total</div>
        </div>
      </div>

      {/* Today&apos;s Schedule */}
      <div className="mx-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Schedule</h2>
          <Link href="/schedules" className="text-blue-600 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        <div className="space-y-3">
          {todayTasks.map((task) => {
            const Icon = getTaskIcon(task.type)
            const colorClass = getTaskColor(task.type)
            return (
              <div
                key={task.id}
                className={`bg-white border border-gray-200 p-4 border-l-4 ${
                  task.status === 'completed' ? 'border-gray-400' : 'border-gray-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-semibold text-gray-900">{task.time}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                        <Icon size={12} className="inline mr-1" />
                        {task.type}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">{task.resident}</div>
                    <div className="text-sm text-gray-600">{task.task}</div>
                  </div>
                  <button
                    className={`ml-4 p-2 ${
                      task.status === 'completed'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mx-4 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/residents"
            className="bg-white border border-gray-200 p-4 flex items-center justify-center flex-col"
          >
            <Users className="text-gray-700 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Residents</span>
          </Link>
          <Link
            href="/health-records"
            className="bg-white border border-gray-200 p-4 flex items-center justify-center flex-col"
          >
            <Heart className="text-gray-700 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Health Records</span>
          </Link>
          <Link
            href="/schedules"
            className="bg-white border border-gray-200 p-4 flex items-center justify-center flex-col"
          >
            <Calendar className="text-gray-700 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Schedules</span>
          </Link>
          <Link
            href="/family"
            className="bg-white border border-gray-200 p-4 flex items-center justify-center flex-col"
          >
            <Users className="text-gray-700 mb-2" size={24} />
            <span className="text-sm font-medium text-gray-900">Family Sharing</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <Link href="/caregiver-mobile" className="flex flex-col items-center text-blue-600">
            <Calendar size={24} />
            <span className="text-xs mt-1">Today</span>
          </Link>
          <Link href="/schedules" className="flex flex-col items-center text-gray-400">
            <Clock size={24} />
            <span className="text-xs mt-1">Schedule</span>
          </Link>
          <Link href="/residents" className="flex flex-col items-center text-gray-400">
            <Users size={24} />
            <span className="text-xs mt-1">Residents</span>
          </Link>
          <Link href="/family" className="flex flex-col items-center text-gray-400">
            <Users size={24} />
            <span className="text-xs mt-1">Family</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

