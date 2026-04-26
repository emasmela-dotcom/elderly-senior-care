import Link from 'next/link'
import {
  Users,
  Calendar,
  FileText,
  Activity,
  Heart,
  Shield,
  Share2,
  Smartphone,
  Pill,
  Activity as ActivityIcon,
  ClipboardList,
} from 'lucide-react'
import { WatercolorLeaves } from '@/components/WatercolorLeaves'

export default function Home() {
  const userName = ''
  const hour = new Date().getHours()
  const greetingPrefix = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const greeting = userName.trim() ? `${greetingPrefix}, ${userName.trim()}` : greetingPrefix

  const features = [
    {
      icon: Users,
      title: 'Resident Management',
      description: 'Comprehensive profiles and health records for all residents',
      href: '/residents',
    },
    {
      icon: Calendar,
      title: 'Care Schedules',
      description: 'Manage medication, appointments, and daily care routines',
      href: '/schedules',
    },
    {
      icon: FileText,
      title: 'Health Records',
      description: 'Track medical history, medications, and vital signs',
      href: '/health-records',
    },
    {
      icon: Activity,
      title: 'Activity Tracking',
      description: 'Monitor daily activities and engagement programs',
      href: '/activities',
    },
    {
      icon: Heart,
      title: 'Caregiver Management',
      description: 'Staff scheduling, assignments, and performance tracking',
      href: '/caregivers',
    },
    {
      icon: Shield,
      title: 'Safety & Compliance',
      description: 'Incident reports, safety protocols, and regulatory compliance',
      href: '/safety',
    },
    {
      icon: Share2,
      title: 'Family Sharing',
      description: 'Share health data with family members and caregivers',
      href: '/family',
    },
    {
      icon: Smartphone,
      title: 'Mobile Caregiver View',
      description: 'Optimized mobile experience for caregivers',
      href: '/caregiver-mobile',
    },
    {
      icon: Pill,
      title: 'Medication Reminders',
      description: 'Push notifications with pill photos and scheduling',
      href: '/medications',
    },
    {
      icon: ActivityIcon,
      title: 'Vital Signs Tracking',
      description: 'Blood pressure, weight, glucose with charts',
      href: '/vitals',
    },
    {
      icon: Calendar,
      title: 'Appointment Management',
      description: 'Doctor visits with prep checklists',
      href: '/appointments',
    },
    {
      icon: ClipboardList,
      title: 'Symptom Logging',
      description: 'Daily health notes for doctor visits',
      href: '/symptoms',
    },
  ]

  const stats = [
    {
      value: 0,
      label: 'Active Residents',
      emptyText: 'No residents added yet - tap to add your first one.',
      href: '/residents/new',
    },
    {
      value: 0,
      label: 'Caregivers',
      emptyText: 'No caregivers added yet - tap to add your first one.',
      href: '/caregivers/new',
    },
    {
      value: 0,
      label: "Today's Appointments",
      emptyText: 'No appointments today - tap to schedule one.',
      href: '/appointments/new',
    },
    {
      value: 0,
      label: 'Pending Tasks',
      emptyText: 'No tasks pending right now - check schedules to plan today.',
      href: '/schedules',
    },
  ]

  const appointmentsToday = stats.find((stat) => stat.label === "Today's Appointments")?.value ?? 0
  const pendingTasks = stats.find((stat) => stat.label === 'Pending Tasks')?.value ?? 0
  const todayAtAGlance =
    appointmentsToday === 0 && pendingTasks === 0
      ? 'Today at a glance: You have no appointments or pending care tasks scheduled today.'
      : `Today at a glance: You have ${pendingTasks} pending ${pendingTasks === 1 ? 'task' : 'tasks'} and ${appointmentsToday} ${appointmentsToday === 1 ? 'appointment' : 'appointments'} today.`

  return (
    <div className="relative container mx-auto px-4 py-10 md:py-14">
      <section className="relative mx-auto mb-14 max-w-3xl text-center">
        <WatercolorLeaves />
        <p className="font-display text-sm font-medium uppercase tracking-[0.2em] text-garden-sage-600">
          Garden & nature
        </p>
        <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-garden-sage-900 md:text-5xl">
          CareConnect 24/7
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-garden-wood/80">
          A calm place for care—like a quiet Sunday morning. Gentle tools for medications, visits, and the people you
          look after.
        </p>
        <div className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-garden-clay-300/80 to-transparent" />
      </section>

      <section className="garden-surface-muted mb-10 p-6 md:p-7">
        <h2 className="font-display text-2xl font-semibold text-garden-sage-900">{greeting}</h2>
        <p className="mt-2 text-base leading-relaxed text-garden-wood/80">{todayAtAGlance}</p>
      </section>

      <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="garden-surface relative overflow-hidden px-5 py-6 text-center"
          >
            <div className="font-display text-3xl font-semibold text-garden-sage-700">{s.value}</div>
            <div className="mt-1 text-sm text-garden-wood/70">{s.label}</div>
            {s.value === 0 ? <p className="mt-3 text-sm leading-relaxed text-garden-wood/75">{s.emptyText}</p> : null}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.title}
              href={feature.href}
              className="garden-surface group relative overflow-hidden p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-2xl border border-garden-sage-200/80 bg-garden-sage-50/80 p-3 text-garden-sage-700 shadow-inner">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-semibold text-garden-sage-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-garden-wood/75">{feature.description}</p>
            </Link>
          )
        })}
      </div>

      <div className="garden-surface-muted relative mt-14 overflow-hidden p-6 md:p-8">
        <WatercolorLeaves />
        <h2 className="font-display relative text-2xl font-semibold text-garden-sage-900">Quick actions</h2>
        <div className="relative mt-5 flex flex-wrap gap-3">
          <Link href="/caregiver-mobile" className="garden-btn">
            Mobile Caregiver View
          </Link>
          <Link href="/family" className="garden-btn">
            Family Sharing
          </Link>
          <Link href="/residents/new" className="garden-btn-outline">
            Add New Resident
          </Link>
          <Link href="/schedules/new" className="garden-btn-outline">
            Create Schedule
          </Link>
        </div>
      </div>
    </div>
  )
}
