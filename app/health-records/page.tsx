import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'

export default function HealthRecordsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          <p className="text-gray-600 mt-1">Track medical history, medications, and vital signs</p>
        </div>
        <Link
          href="/health-records/new"
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Health Record
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No health records yet</h3>
        <p className="text-gray-600 mb-4">Start tracking health information for residents.</p>
        <Link
          href="/health-records/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Health Record
        </Link>
      </div>
    </div>
  )
}

