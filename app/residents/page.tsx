import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'

export default function ResidentsPage() {
  // Mock data - replace with actual data fetching
  const residents = []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
          <p className="text-gray-600 mt-1">Manage resident profiles and information</p>
        </div>
        <Link
          href="/residents/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add New Resident
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search residents by name, room number, or ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50">
            <Filter size={20} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Residents List */}
      {residents.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No residents yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first resident.</p>
          <Link
            href="/residents/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add New Resident
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Resident cards will be rendered here */}
        </div>
      )}
    </div>
  )
}

