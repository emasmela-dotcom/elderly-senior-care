import Link from 'next/link'
import { Users, Share2, Shield, Bell, Eye } from 'lucide-react'
import { DownloadJsonButton } from '@/components/DownloadJsonButton'

export default function FamilyPage() {
  // Mock data - replace with actual data fetching
  const sharedResidents = []
  const familyMembers = []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-garden-wood mb-2">Family & Caregiver Sharing</h1>
          <p className="text-garden-wood/75">
            Manage access and permissions for family members and caregivers.
          </p>
        </div>
        <DownloadJsonButton
          filename="family-sharing.json"
          data={{ sharedResidents, familyMembers }}
        />
      </div>

      {/* Sharing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-garden-sage-200/65 p-6">
          <div className="flex items-center justify-between mb-4">
            <Share2 className="text-garden-wood/80" size={24} />
            <span className="text-sm text-garden-wood/60">Active Shares</span>
          </div>
          <div className="text-3xl font-bold text-garden-wood mb-1">0</div>
          <div className="text-sm text-garden-wood/75">Residents with shared access</div>
        </div>
        <div className="bg-white border border-garden-sage-200/65 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-garden-wood/80" size={24} />
            <span className="text-sm text-garden-wood/60">Family Members</span>
          </div>
          <div className="text-3xl font-bold text-garden-wood mb-1">0</div>
          <div className="text-sm text-garden-wood/75">Authorized family members</div>
        </div>
        <div className="bg-white border border-garden-sage-200/65 p-6">
          <div className="flex items-center justify-between mb-4">
            <Eye className="text-garden-wood/80" size={24} />
            <span className="text-sm text-garden-wood/60">Caregivers</span>
          </div>
          <div className="text-3xl font-bold text-garden-wood mb-1">0</div>
          <div className="text-sm text-garden-wood/75">With viewing permissions</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-garden-sage-200/65 p-6 mb-8">
        <h2 className="text-xl font-semibold text-garden-wood mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/family/share"
            className="flex items-center p-4 border-2 border-dashed border-garden-clay-200/85 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Share2 className="text-garden-wood/80 mr-3" size={24} />
            <div>
              <div className="font-semibold text-garden-wood">Share Health Data</div>
              <div className="text-sm text-garden-wood/75">Grant access to family members or caregivers</div>
            </div>
          </Link>
          <Link
            href="/family/members"
            className="flex items-center p-4 border-2 border-dashed border-garden-clay-200/85 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Users className="text-garden-wood/80 mr-3" size={24} />
            <div>
              <div className="font-semibold text-garden-wood">Manage Family Members</div>
              <div className="text-sm text-garden-wood/75">Add or remove authorized users</div>
            </div>
          </Link>
          <Link
            href="/family/permissions"
            className="flex items-center p-4 border-2 border-dashed border-garden-clay-200/85 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Shield className="text-garden-wood/80 mr-3" size={24} />
            <div>
              <div className="font-semibold text-garden-wood">Privacy Settings</div>
              <div className="text-sm text-garden-wood/75">Control what data is shared</div>
            </div>
          </Link>
          <Link
            href="/family/notifications"
            className="flex items-center p-4 border-2 border-dashed border-garden-clay-200/85 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Bell className="text-garden-wood/80 mr-3" size={24} />
            <div>
              <div className="font-semibold text-garden-wood">Notification Preferences</div>
              <div className="text-sm text-garden-wood/75">Configure alerts and updates</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Shared Residents */}
      <div className="bg-white border border-garden-sage-200/65 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-garden-wood">Shared Residents</h2>
          <Link
            href="/family/share"
            className="text-garden-sage-700 hover:text-garden-sage-800 text-sm font-medium"
          >
            Share New →
          </Link>
        </div>
        {sharedResidents.length === 0 ? (
          <div className="text-center py-12">
            <Share2 className="mx-auto h-12 w-12 text-garden-wood/45 mb-4" />
            <h3 className="text-lg font-medium text-garden-wood mb-2">No shared residents yet</h3>
            <p className="text-garden-wood/75 mb-4">
              Start sharing health data with family members and caregivers to keep everyone informed.
            </p>
            <Link
              href="/family/share"
              className="inline-flex items-center px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
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

