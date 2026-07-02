'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, CreditCard } from 'lucide-react'
import { PLANS, TRIAL_DAYS } from '@/lib/stripe'

type SubStatus = {
  configured: boolean
  active: boolean
  status: string
  planInterval: string | null
  trialEnd: string | null
  currentPeriodEnd: string | null
}

export default function PricingClient() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [sub, setSub] = useState<SubStatus | null>(null)

  const success = searchParams.get('success') === '1'
  const canceled = searchParams.get('canceled') === '1'

  useEffect(() => {
    if (!session) return
    void fetch('/api/stripe/status', { credentials: 'same-origin' })
      .then(async (res) => {
        if (!res.ok) return
        setSub((await res.json()) as SubStatus)
      })
      .catch(() => undefined)
  }, [session, success])

  async function startCheckout(plan: 'monthly' | 'yearly') {
    if (!session) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent('/pricing')}`
      return
    }
    setLoading(plan)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not start checkout.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(null)
    }
  }

  async function openPortal() {
    setLoading('portal')
    setError('')
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        credentials: 'same-origin',
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Could not open billing.')
        return
      }
      window.location.href = data.url
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 md:py-14">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-semibold text-care-text md:text-4xl">
          CareConnect 24/7 plans
        </h1>
        <p className="mt-3 text-base leading-relaxed text-care-muted">
          {TRIAL_DAYS}-day free trial, then keep everything in one place — medications,
          appointments, vitals, and sync.
        </p>
      </header>

      {success ? (
        <p
          className="mx-auto mb-6 flex max-w-xl items-center justify-center gap-2 rounded-garden border border-care-primary/30 bg-care-hover px-4 py-3 text-base text-care-text"
          role="status"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-care-primary" aria-hidden />
          You&apos;re all set. Your trial has started.
        </p>
      ) : null}

      {canceled ? (
        <p className="mx-auto mb-6 max-w-xl text-center text-base text-care-muted" role="status">
          Checkout canceled. Pick a plan when you&apos;re ready.
        </p>
      ) : null}

      {sub?.active ? (
        <div className="garden-surface mx-auto mb-8 max-w-xl p-6 text-center">
          <p className="text-base text-care-text">
            Your plan is{' '}
            <strong>{sub.status === 'trialing' ? 'in free trial' : 'active'}</strong>
            {sub.planInterval ? ` (${sub.planInterval}ly)` : ''}.
          </p>
          <button
            type="button"
            onClick={() => void openPortal()}
            disabled={loading === 'portal'}
            className="garden-btn-outline mt-4 inline-flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" aria-hidden />
            {loading === 'portal' ? 'Opening…' : 'Manage billing'}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="mx-auto mb-6 max-w-xl text-center text-base text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
        {([PLANS.monthly, PLANS.yearly] as const).map((plan) => (
          <div key={plan.id} className="garden-surface flex flex-col p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-care-text">{plan.label}</h2>
            <p className="mt-2 font-display text-4xl font-semibold text-care-primary">
              ${plan.price}
              <span className="text-lg font-normal text-care-muted">
                /{plan.interval === 'month' ? 'mo' : 'yr'}
              </span>
            </p>
            {plan.id === 'yearly' ? (
              <p className="mt-1 text-sm text-care-muted">Save vs paying monthly</p>
            ) : null}
            <ul className="mt-5 flex-1 space-y-2 text-sm text-care-text">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-care-success" aria-hidden />
                {TRIAL_DAYS}-day free trial
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-care-success" aria-hidden />
                Medications, appointments, vitals
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-care-success" aria-hidden />
                Sync with Google, Apple, MyChart
              </li>
            </ul>
            <button
              type="button"
              onClick={() => void startCheckout(plan.id)}
              disabled={Boolean(loading) || sub?.active}
              className="garden-btn mt-6 w-full min-h-[48px] disabled:opacity-60"
            >
              {loading === plan.id
                ? 'Starting…'
                : sub?.active
                  ? 'Current plan'
                  : `Start ${TRIAL_DAYS}-day free trial`}
            </button>
          </div>
        ))}
      </div>

      {!session ? (
        <p className="mx-auto mt-8 max-w-xl text-center text-base text-care-muted">
          <Link href="/login" className="font-semibold text-care-primary underline underline-offset-2">
            Sign in
          </Link>{' '}
          first, then choose a plan.
        </p>
      ) : null}
    </div>
  )
}
