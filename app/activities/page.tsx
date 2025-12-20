import Link from 'next/link'
import { Plus, Activity } from 'lucide-react'

export default function ActivitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">Monitor daily activities and engagement programs</p>
        </div>
        <Link
          href="/activities/new"
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Activity
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities yet</h3>
        <p className="text-gray-600 mb-4">Create activity programs to engage residents.</p>
        <Link
          href="/activities/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Activity
        </Link>
      </div>
    </div>
  )
}

