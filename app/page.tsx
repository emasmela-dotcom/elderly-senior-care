import Link from 'next/link'
import { Users, Calendar, FileText, Activity, Heart, Shield, Share2, Smartphone, Pill, Activity as ActivityIcon, ClipboardList } from 'lucide-react'

export default function Home() {
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Senior Care Management System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Comprehensive care management platform for elderly and senior care facilities.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
          <div className="text-gray-600">Active Residents</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
          <div className="text-gray-600">Caregivers</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
          <div className="text-gray-600">Today&apos;s Appointments</div>
        </div>
        <div className="bg-white border border-gray-200 p-6 text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
          <div className="text-gray-600">Pending Tasks</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.title}
              href={feature.href}
              className="bg-white border border-gray-200 p-6 hover:border-blue-600 transition-colors"
            >
              <div className="w-12 h-12 border border-gray-300 flex items-center justify-center mb-4">
                <Icon className="text-gray-700" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-white border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/caregiver-mobile"
            className="px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            Mobile Caregiver View
          </Link>
          <Link
            href="/family"
            className="px-4 py-2 bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-colors"
          >
            Family Sharing
          </Link>
          <Link
            href="/residents/new"
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Add New Resident
          </Link>
          <Link
            href="/schedules/new"
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Create Schedule
          </Link>
        </div>
      </div>
    </div>
  )
}

