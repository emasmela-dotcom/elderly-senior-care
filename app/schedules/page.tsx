import Link from 'next/link'
import { Plus, Calendar as CalendarIcon } from 'lucide-react'

export default function SchedulesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Care Schedules</h1>
          <p className="text-gray-600 mt-1">Manage medication schedules, appointments, and daily care routines</p>
        </div>
        <Link
          href="/schedules/new"
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Schedule
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules yet</h3>
        <p className="text-gray-600 mb-4">Create schedules for medications, appointments, and care activities.</p>
        <Link
          href="/schedules/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Schedule
        </Link>
      </div>
    </div>
  )
}

