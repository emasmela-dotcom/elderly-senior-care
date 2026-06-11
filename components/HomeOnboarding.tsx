'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const STORAGE_KEY = 'careconnect-onboarding-v1'

export function HomeOnboarding() {
  const [step, setStep] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const done = window.localStorage.getItem(STORAGE_KEY) === 'done'
      setStep(done ? 0 : 1)
      setReady(true)
    } catch {
      setReady(true)
    }
  }, [])

  function finish() {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'done')
    } catch {
      // ignore storage failures
    }
    setStep(0)
  }

  if (!ready || step === 0) return null

  return (
    <section
      className="garden-surface mb-10 border-[#4A8FA8]/25 p-6 md:p-8"
      aria-label="Getting started"
    >
      <p className="text-sm font-medium uppercase tracking-wide text-[#4A8FA8]">
        Step {step} of 3
      </p>

      {step === 1 ? (
        <>
          <h2 className="font-display mt-2 text-2xl font-semibold text-[#1a1a1a]">
            Welcome — you&apos;re in charge
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1a1a1a]/80">
            CareConnect is your personal assistant for daily health and routines. We help you stay
            organized — simply and calmly.
          </p>
          <button type="button" onClick={() => setStep(2)} className="garden-btn mt-6">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </button>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <h2 className="font-display mt-2 text-2xl font-semibold text-[#1a1a1a]">
            Start with what matters today
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1a1a1a]/80">
            Most people begin with medications, appointments, and the people they trust. You can
            explore everything else whenever you&apos;re ready.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-[#1a1a1a]/85">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#6B8F71]" aria-hidden />
              Medications and reminders
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#6B8F71]" aria-hidden />
              Appointments and schedule
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#6B8F71]" aria-hidden />
              My People — family and helpers you choose
            </li>
          </ul>
          <button type="button" onClick={() => setStep(3)} className="garden-btn mt-6">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </button>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <h2 className="font-display mt-2 text-2xl font-semibold text-[#1a1a1a]">
            Quick setup (about 2 minutes)
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1a1a1a]/80">
            Pick one to begin. You can do the rest later.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/medications/new" onClick={finish} className="garden-btn">
              Add your first medication
            </Link>
            <Link href="/appointments/new" onClick={finish} className="garden-btn-outline">
              Schedule an appointment
            </Link>
            <Link href="/family" onClick={finish} className="garden-btn-outline">
              Invite someone you trust
            </Link>
          </div>
          <button type="button" onClick={finish} className="mt-4 text-sm text-[#1a1a1a]/70 underline-offset-2 hover:underline">
            Skip for now
          </button>
        </>
      ) : null}
    </section>
  )
}
