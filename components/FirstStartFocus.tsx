'use client'

import Link from 'next/link'
import { Calendar, Pill } from 'lucide-react'

const DISMISS_KEY = 'careconnect-first-start-dismissed'

export function readFirstStartDismissed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(DISMISS_KEY) === 'yes'
  } catch {
    return false
  }
}

export function dismissFirstStart(): void {
  try {
    window.localStorage.setItem(DISMISS_KEY, 'yes')
  } catch {
    // ignore
  }
}

type FirstStartFocusProps = {
  onExplore?: () => void
}

export function FirstStartFocus({ onExplore }: FirstStartFocusProps) {
  return (
    <section
      className="garden-surface mb-10 border-care-primary/30 p-8 md:p-10 text-center"
      aria-labelledby="first-start-heading"
    >
      <h2 id="first-start-heading" className="font-display text-3xl font-semibold text-care-text md:text-4xl">
        Let&apos;s start with one thing
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-care-muted">
        Pick one step below. We&apos;ll show the rest of the app after you add a medication or an
        appointment.
      </p>
      <div className="mx-auto mt-8 flex max-w-lg flex-col gap-4">
        <Link
          href="/medications/new"
          className="garden-btn min-h-[56px] w-full text-base md:text-lg"
        >
          <Pill className="mr-2 h-6 w-6 shrink-0" aria-hidden />
          Add your first medication
        </Link>
        <Link
          href="/appointments/new"
          className="garden-btn-outline min-h-[56px] w-full text-base md:text-lg"
        >
          <Calendar className="mr-2 h-6 w-6 shrink-0" aria-hidden />
          Schedule an appointment
        </Link>
      </div>
      <button
        type="button"
        onClick={onExplore}
        className="mt-6 text-base text-care-muted underline-offset-2 hover:underline"
      >
        I&apos;ll explore on my own
      </button>
    </section>
  )
}
