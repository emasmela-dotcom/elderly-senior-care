'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditResidentPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params?.id ?? '')
  const [full_name, setFullName] = useState('')
  const [room_number, setRoomNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/residents/${id}`, { credentials: 'same-origin' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || cancelled) {
          setError((data as { error?: string }).error || 'Not found')
          return
        }
        const r = data as {
          full_name: string
          room_number: string | null
          notes: string | null
        }
        setFullName(r.full_name)
        setRoomNumber(r.room_number ?? '')
        setNotes(r.notes ?? '')
      } catch {
        setError('Network error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/residents/${id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name,
          room_number: room_number || null,
          notes: notes || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Save failed')
        return
      }
      router.push('/residents')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Invalid link.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit resident</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white border border-gray-200 p-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-900 mb-1">
            Full name
          </label>
          <input
            id="full_name"
            required
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
        <div>
          <label htmlFor="room_number" className="block text-sm font-medium text-gray-900 mb-1">
            Room number
          </label>
          <input
            id="room_number"
            value={room_number}
            onChange={(e) => setRoomNumber(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <Link
            href="/residents"
            className="px-4 py-2 border border-gray-300 text-gray-900 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
