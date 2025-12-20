import Link from 'next/link'
import { Users, Share2, Shield, Bell, Eye } from 'lucide-react'

export default function FamilyPage() {
  // Mock data - replace with actual data fetching
  const sharedResidents = []
  const familyMembers = []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Family & Caregiver Sharing</h1>
        <p className="text-gray-600">
          73.9% of older adults are willing to share health app information with family members or caregivers.
          Manage access and permissions here.
        </p>
      </div>

      {/* Sharing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Share2 className="text-primary-600" size={24} />
            <span className="text-sm text-gray-500">Active Shares</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">Residents with shared access</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-green-600" size={24} />
            <span className="text-sm text-gray-500">Family Members</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">Authorized family members</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Eye className="text-purple-600" size={24} />
            <span className="text-sm text-gray-500">Caregivers</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">With viewing permissions</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/family/share"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Share2 className="text-primary-600 mr-3" size={24} />
            <div>
              <div className="font-semibold text-gray-900">Share Health Data</div>
              <div className="text-sm text-gray-600">Grant access to family members or caregivers</div>
            </div>
          </Link>
          <Link
            href="/family/members"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Users className="text-primary-600 mr-3" size={24} />
            <div>
              <div className="font-semibold text-gray-900">Manage Family Members</div>
              <div className="text-sm text-gray-600">Add or remove authorized users</div>
            </div>
          </Link>
          <Link
            href="/family/permissions"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Shield className="text-primary-600 mr-3" size={24} />
            <div>
              <div className="font-semibold text-gray-900">Privacy Settings</div>
              <div className="text-sm text-gray-600">Control what data is shared</div>
            </div>
          </Link>
          <Link
            href="/family/notifications"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Bell className="text-primary-600 mr-3" size={24} />
            <div>
              <div className="font-semibold text-gray-900">Notification Preferences</div>
              <div className="text-sm text-gray-600">Configure alerts and updates</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Shared Residents */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Shared Residents</h2>
          <Link
            href="/family/share"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Share New →
          </Link>
        </div>
        {sharedResidents.length === 0 ? (
          <div className="text-center py-12">
            <Share2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shared residents yet</h3>
            <p className="text-gray-600 mb-4">
              Start sharing health data with family members and caregivers to keep everyone informed.
            </p>
            <Link
              href="/family/share"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Share2 size={20} className="mr-2" />
              Share Health Data
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Shared resident cards will be rendered here */}
          </div>
        )}
      </div>
    </div>
  )
}

