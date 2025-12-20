import Link from 'next/link'
import { Users, Calendar, FileText, Activity, Heart, Shield, Share2, Smartphone } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Resident Management',
      description: 'Comprehensive profiles and health records for all residents',
      href: '/residents',
      color: 'bg-blue-500',
    },
    {
      icon: Calendar,
      title: 'Care Schedules',
      description: 'Manage medication, appointments, and daily care routines',
      href: '/schedules',
      color: 'bg-green-500',
    },
    {
      icon: FileText,
      title: 'Health Records',
      description: 'Track medical history, medications, and vital signs',
      href: '/health-records',
      color: 'bg-purple-500',
    },
    {
      icon: Activity,
      title: 'Activity Tracking',
      description: 'Monitor daily activities and engagement programs',
      href: '/activities',
      color: 'bg-orange-500',
    },
    {
      icon: Heart,
      title: 'Caregiver Management',
      description: 'Staff scheduling, assignments, and performance tracking',
      href: '/caregivers',
      color: 'bg-red-500',
    },
    {
      icon: Shield,
      title: 'Safety & Compliance',
      description: 'Incident reports, safety protocols, and regulatory compliance',
      href: '/safety',
      color: 'bg-indigo-500',
    },
    {
      icon: Share2,
      title: 'Family Sharing',
      description: 'Share health data with family members and caregivers (73.9% willing to share)',
      href: '/family',
      color: 'bg-pink-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile Caregiver View',
      description: 'Optimized mobile experience for caregivers on-the-go',
      href: '/caregiver-mobile',
      color: 'bg-cyan-500',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Smartphone className="text-primary-600 mr-3" size={32} />
          <h1 className="text-5xl font-bold text-gray-900">
            Mobile-First Caregiver App
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
          Streamline operations, enhance care quality, and improve resident outcomes
          with our comprehensive mobile-first care management platform.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="mr-2" size={16} />
            <span>42% of 65+ own smartphones</span>
          </div>
          <div className="flex items-center">
            <Share2 className="mr-2" size={16} />
            <span>73.9% willing to share health data</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
          <div className="text-gray-600">Active Residents</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
          <div className="text-gray-600">Caregivers</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
          <div className="text-gray-600">Today's Appointments</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">0</div>
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
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
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
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/caregiver-mobile"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <Smartphone size={18} className="mr-2" />
            Mobile Caregiver View
          </Link>
          <Link
            href="/family"
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center"
          >
            <Share2 size={18} className="mr-2" />
            Family Sharing
          </Link>
          <Link
            href="/residents/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Resident
          </Link>
          <Link
            href="/schedules/new"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Schedule
          </Link>
        </div>
      </div>
    </div>
  )
}

