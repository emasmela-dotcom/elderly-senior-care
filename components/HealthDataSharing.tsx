'use client'

import { useState } from 'react'
import { Share2, Users, Eye, EyeOff, CheckCircle2, X } from 'lucide-react'

interface HealthDataSharingProps {
  residentId?: string
  residentName?: string
}

export default function HealthDataSharing({ 
  residentId, 
  residentName = 'Resident' 
}: HealthDataSharingProps) {
  const [sharedWith, setSharedWith] = useState([
    { id: 1, name: 'John Smith', relationship: 'Son', access: 'full', email: 'john@example.com' },
    { id: 2, name: 'Sarah Smith', relationship: 'Daughter', access: 'limited', email: 'sarah@example.com' },
  ])

  const [showShareModal, setShowShareModal] = useState(false)
  const [newShareEmail, setNewShareEmail] = useState('')
  const [newShareRelationship, setNewShareRelationship] = useState('')
  const [newShareAccess, setNewShareAccess] = useState<'full' | 'limited'>('limited')

  const handleShare = () => {
    if (newShareEmail) {
      // In a real app, this would make an API call
      const newShare = {
        id: sharedWith.length + 1,
        name: newShareEmail.split('@')[0],
        relationship: newShareRelationship || 'Family Member',
        access: newShareAccess,
        email: newShareEmail,
      }
      setSharedWith([...sharedWith, newShare])
      setNewShareEmail('')
      setNewShareRelationship('')
      setNewShareAccess('limited')
      setShowShareModal(false)
    }
  }

  const handleRemove = (id: number) => {
    setSharedWith(sharedWith.filter(share => share.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Share2 className="mr-2 text-primary-600" size={20} />
            Health Data Sharing
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Share {residentName}'s health information with family members and caregivers
          </p>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Share2 size={16} className="inline mr-2" />
          Share
        </button>
      </div>

      {/* Sharing Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-primary-600">{sharedWith.length}</div>
          <div className="text-sm text-gray-600 mt-1">People with access</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {sharedWith.filter(s => s.access === 'full').length}
          </div>
          <div className="text-sm text-gray-600 mt-1">Full access</div>
        </div>
      </div>

      {/* Shared With List */}
      <div className="space-y-3">
        {sharedWith.map((share) => (
          <div
            key={share.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <Users className="text-primary-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{share.name}</div>
                <div className="text-sm text-gray-600">{share.relationship} • {share.email}</div>
              </div>
              <div className="flex items-center mr-4">
                {share.access === 'full' ? (
                  <Eye className="text-green-600 mr-2" size={18} />
                ) : (
                  <EyeOff className="text-gray-400 mr-2" size={18} />
                )}
                <span className="text-sm text-gray-600 capitalize">{share.access} access</span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(share.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove access"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Health Data</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newShareEmail}
                  onChange={(e) => setNewShareEmail(e.target.value)}
                  placeholder="family@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  value={newShareRelationship}
                  onChange={(e) => setNewShareRelationship(e.target.value)}
                  placeholder="Son, Daughter, Caregiver, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="access"
                      value="full"
                      checked={newShareAccess === 'full'}
                      onChange={() => setNewShareAccess('full')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Full Access</div>
                      <div className="text-sm text-gray-600">View all health records and data</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="access"
                      value="limited"
                      checked={newShareAccess === 'limited'}
                      onChange={() => setNewShareAccess('limited')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Limited Access</div>
                      <div className="text-sm text-gray-600">View basic information only</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <CheckCircle2 size={16} className="inline mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

