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
    <div className="bg-white border border-garden-sage-200/65 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-garden-wood flex items-center">
            <Share2 className="mr-2 text-garden-wood/80" size={20} />
            Health Data Sharing
          </h3>
          <p className="text-sm text-garden-wood/75 mt-1">
            Share {residentName}&apos;s health information with family members and caregivers
          </p>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors text-sm font-medium"
        >
          <Share2 size={16} className="inline mr-2" />
          Share
        </button>
      </div>

      {/* Sharing Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-garden-sage-200/65 p-4">
          <div className="text-2xl font-bold text-garden-wood">{sharedWith.length}</div>
          <div className="text-sm text-garden-wood/75 mt-1">People with access</div>
        </div>
        <div className="bg-white border border-garden-sage-200/65 p-4">
          <div className="text-2xl font-bold text-garden-wood">
            {sharedWith.filter(s => s.access === 'full').length}
          </div>
          <div className="text-sm text-garden-wood/75 mt-1">Full access</div>
        </div>
      </div>

      {/* Shared With List */}
      <div className="space-y-3">
        {sharedWith.map((share) => (
          <div
            key={share.id}
            className="flex items-center justify-between p-4 border border-garden-sage-200/65 rounded-lg hover:bg-garden-sage-50/70"
          >
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 bg-garden-sage-100/75 border border-garden-clay-200/85 flex items-center justify-center mr-3">
                <Users className="text-garden-wood/80" size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-garden-wood">{share.name}</div>
                <div className="text-sm text-garden-wood/75">{share.relationship} • {share.email}</div>
              </div>
              <div className="flex items-center mr-4">
                {share.access === 'full' ? (
                  <Eye className="text-garden-wood/80 mr-2" size={18} />
                ) : (
                  <EyeOff className="text-garden-wood/45 mr-2" size={18} />
                )}
                <span className="text-sm text-garden-wood/75 capitalize">{share.access} access</span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(share.id)}
              className="p-2 text-garden-wood/75 hover:bg-garden-sage-100/75 transition-colors"
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
          <div className="bg-white border border-garden-sage-200/65 max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-garden-wood mb-4">Share Health Data</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="share-email" className="block text-sm font-medium text-garden-wood/80 mb-2">
                  Email Address
                </label>
                <input
                  id="share-email"
                  type="email"
                  value={newShareEmail}
                  onChange={(e) => setNewShareEmail(e.target.value)}
                  placeholder="family@example.com"
                  className="w-full px-4 py-2 border border-garden-clay-200/85 text-garden-wood placeholder:text-garden-wood/60 focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
                />
              </div>
              
              <div>
                <label htmlFor="share-relationship" className="block text-sm font-medium text-garden-wood/80 mb-2">
                  Relationship
                </label>
                <input
                  id="share-relationship"
                  type="text"
                  value={newShareRelationship}
                  onChange={(e) => setNewShareRelationship(e.target.value)}
                  placeholder="Son, Daughter, Caregiver, etc."
                  className="w-full px-4 py-2 border border-garden-clay-200/85 text-garden-wood placeholder:text-garden-wood/60 focus:ring-2 focus:ring-garden-sage-500 focus:border-garden-sage-600"
                />
              </div>
              
              <fieldset className="border-0 p-0 m-0">
                <legend className="block text-sm font-medium text-garden-wood/80 mb-2">Access Level</legend>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 border border-garden-clay-200/85 hover:bg-garden-sage-50/70">
                    <input
                      id="access-full"
                      type="radio"
                      name="access"
                      value="full"
                      checked={newShareAccess === 'full'}
                      onChange={() => setNewShareAccess('full')}
                      className="mt-1 shrink-0"
                    />
                    <label htmlFor="access-full" className="cursor-pointer text-garden-wood flex-1">
                      <span className="font-medium block">Full Access</span>
                      <span className="text-sm text-garden-wood/75 block">View all health records and data</span>
                    </label>
                  </div>
                  <div className="flex items-start gap-3 p-3 border border-garden-clay-200/85 hover:bg-garden-sage-50/70">
                    <input
                      id="access-limited"
                      type="radio"
                      name="access"
                      value="limited"
                      checked={newShareAccess === 'limited'}
                      onChange={() => setNewShareAccess('limited')}
                      className="mt-1 shrink-0"
                    />
                    <label htmlFor="access-limited" className="cursor-pointer text-garden-wood flex-1">
                      <span className="font-medium block">Limited Access</span>
                      <span className="text-sm text-garden-wood/75 block">View basic information only</span>
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-garden-clay-200/85 rounded-lg text-garden-wood/80 hover:bg-garden-sage-50/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-garden-sage-600 text-white border border-garden-sage-700 hover:bg-garden-sage-700 transition-colors"
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

