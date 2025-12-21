import Link from 'next/link'
import { Plus, Shield } from 'lucide-react'

export default function SafetyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Safety & Compliance</h1>
          <p className="text-gray-600 mt-1">Incident reports, safety protocols, and regulatory compliance</p>
        </div>
        <Link
          href="/safety/incidents/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Report Incident
        </Link>
      </div>

      <div className="bg-white border border-gray-200 p-8 text-center">
        <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Safety Dashboard</h3>
        <p className="text-gray-600 mb-4">Monitor safety incidents and compliance status.</p>
      </div>
    </div>
  )
}

