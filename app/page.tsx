'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Calendar, FileText, Pill, Users } from 'lucide-react'
import { WatercolorLeaves } from '@/components/WatercolorLeaves'
import { HomeOnboarding } from '@/components/HomeOnboarding'

export default function Home() {
  const { data: session } = useSession()
  const userName = session?.user?.name ?? ''
  const hour = new Date().getHours()
  const greetingPrefix = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const greeting = userName.trim() ? `${greetingPrefix}, ${userName.trim()}` : greetingPrefix

  // TODO: wire counts from APIs when dashboard data is available
  const medicationsCount = 0
  const appointmentsToday = 0
  const peopleCount = 0
  const scheduleItems = 0

  const stats = [
    {
      value: medicationsCount,
      label: 'My Medications',
      emptyText: 'No medications yet — tap to add your first one.',
      href: '/medications/new',
    },
    {
      value: appointmentsToday,
      label: "Today's Appointments",
      emptyText: 'No appointments today — tap to schedule one.',
      href: '/appointments/new',
    },
    {
      value: peopleCount,
      label: 'My People',
      emptyText: 'No one added yet — tap to invite someone you trust.',
      href: '/family',
    },
    {
      value: scheduleItems,
      label: 'Upcoming on Schedule',
      emptyText: 'Nothing on your schedule yet — tap to plan your day.',
      href: '/schedules/new',
    },
  ]

  const glanceParts: string[] = []
  if (medicationsCount > 0) {
    glanceParts.push(
      `${medicationsCount} medication${medicationsCount === 1 ? '' : 's'} to track`
    )
  }
  if (appointmentsToday > 0) {
    glanceParts.push(
      `${appointmentsToday} appointment${appointmentsToday === 1 ? '' : 's'} today`
    )
  }
  if (scheduleItems > 0) {
    glanceParts.push(
      `${scheduleItems} item${scheduleItems === 1 ? '' : 's'} on your schedule`
    )
  }

  const todayAtAGlance =
    glanceParts.length === 0
      ? 'Today at a glance: Your day is open. Add a medication or appointment when you are ready.'
      : `Today at a glance: You have ${glanceParts.join(' and ')}.`

  const todayActions = [
    {
      title: 'Check my medications',
      description: 'See what is due and add a reminder',
      href: '/medications',
      icon: Pill,
    },
    {
      title: "See today's appointments",
      description: 'View visits and schedule a new one',
      href: '/appointments',
      icon: Calendar,
    },
    {
      title: 'Open my schedule',
      description: 'Plan routines and daily tasks',
      href: '/schedules',
      icon: Calendar,
    },
  ]

  const coreFeatures = [
    {
      icon: Pill,
      title: 'Medications',
      description: 'Gentle reminders with clear labels and photos',
      href: '/medications',
    },
    {
      icon: Calendar,
      title: 'Appointments',
      description: 'Doctor visits and prep checklists in one place',
      href: '/appointments',
    },
    {
      icon: FileText,
      title: 'My Health',
      description: 'Records, vitals, and notes for your care team',
      href: '/health-records',
    },
    {
      icon: Users,
      title: 'My People',
      description: 'Family and helpers you choose to stay in the loop',
      href: '/family',
    },
  ]

  return (
    <div className="relative container mx-auto px-4 py-10 md:py-14">
      <section className="relative mx-auto mb-10 max-w-3xl text-center">
        <WatercolorLeaves />
        <h1 className="font-display text-4xl font-semibold leading-tight text-care-text md:text-5xl">
          CareConnect 24/7
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-care-muted">
          You&apos;re in charge. We just make it easier.
        </p>
        <div className="mx-auto mt-6 h-px max-w-xs bg-gradient-to-r from-transparent via-care-secondary to-transparent" />
      </section>

      <HomeOnboarding />

      <section className="garden-surface-muted mb-8 p-6 md:p-7">
        <h2 className="font-display text-2xl font-semibold text-care-text">{greeting}</h2>
        <p className="mt-2 text-base leading-relaxed text-care-muted">{todayAtAGlance}</p>
      </section>

      <section className="mb-10" aria-labelledby="today-actions-heading">
        <h2 id="today-actions-heading" className="font-display mb-4 text-2xl font-semibold text-care-text">
          What would you like to do today?
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {todayActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="garden-surface flex min-h-[8.5rem] flex-col justify-between p-6 transition-shadow hover:shadow-md"
              >
                <div className="inline-flex rounded-2xl border border-garden-sage-200 bg-care-hover p-3 text-care-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-xl font-semibold text-care-text">{action.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-care-muted">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="garden-surface relative overflow-hidden px-5 py-6 text-center"
          >
            {s.value > 0 ? (
              <div className="font-display text-3xl font-semibold text-care-primary">{s.value}</div>
            ) : (
              <p className="text-base font-medium leading-relaxed text-care-text/90">{s.emptyText}</p>
            )}
            <div className="mt-2 text-sm font-medium text-care-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      <section aria-labelledby="core-features-heading">
        <h2 id="core-features-heading" className="font-display mb-4 text-2xl font-semibold text-care-text">
          Your everyday tools
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {coreFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="garden-surface group relative overflow-hidden p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-garden-clay-200 bg-care-hover p-3 text-care-secondary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-display text-xl font-semibold text-care-text">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-care-muted">{feature.description}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
