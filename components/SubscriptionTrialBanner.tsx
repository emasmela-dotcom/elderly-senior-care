'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CreditCard } from 'lucide-react'

type SubStatus = {
  needsPayment?: boolean
  paymentPrompt?: string | null
}

export function SubscriptionTrialBanner() {
  const { data: session } = useSession()
  const [sub, setSub] = useState<SubStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) {
      setSub(null)
      return
    }
    void fetch('/api/stripe/status', { credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) return
        setSub((await res.json()) as SubStatus)
      })
      .catch(() => undefined)
  }, [session])

  if (!session || !sub?.needsPayment || !sub.paymentPrompt) {
    return null
  }

  async function addPayment() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/add-payment', {
        method: 'POST',
        credentials: 'same-origin',
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not open payment form.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="border-b border-amber-300 bg-amber-50 px-4 py-4 text-care-text"
      role="status"
    >
      <div className="container mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-base font-medium leading-relaxed">{sub.paymentPrompt}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => void addPayment()}
            disabled={loading}
            className="garden-btn inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
          >
            <CreditCard className="h-4 w-4" aria-hidden />
            {loading ? 'Opening…' : 'Add payment method'}
          </button>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
