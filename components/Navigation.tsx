'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Home,
  Users,
  Calendar,
  FileText,
  Activity,
  Heart,
  Shield,
  Menu,
  X,
  Share2,
  Pill,
  Activity as ActivityIcon,
  ClipboardList,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useI18n } from '@/components/I18nProvider'
import type { NavKey } from '@/locales/en'

const navigation: { key: NavKey; href: string; icon: typeof Home }[] = [
  { key: 'dashboard', href: '/', icon: Home },
  { key: 'residents', href: '/residents', icon: Users },
  { key: 'caregivers', href: '/caregivers', icon: Heart },
  { key: 'medications', href: '/medications', icon: Pill },
  { key: 'vitals', href: '/vitals', icon: ActivityIcon },
  { key: 'appointments', href: '/appointments', icon: Calendar },
  { key: 'symptoms', href: '/symptoms', icon: ClipboardList },
  { key: 'healthRecords', href: '/health-records', icon: FileText },
  { key: 'activities', href: '/activities', icon: Activity },
  { key: 'safety', href: '/safety', icon: Shield },
  { key: 'family', href: '/family', icon: Share2 },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { t, locale, setLocale } = useI18n()

  return (
    <nav className="bg-white shadow-md" aria-label="Primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/" className="text-2xl font-bold text-gray-900 truncate">
              {t.brand}
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-2 flex-wrap justify-end">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'flex items-center px-3 py-2 text-sm font-medium transition-colors border-b-2',
                    isActive
                      ? 'border-blue-600 text-gray-900'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Icon size={18} className="mr-2 shrink-0" aria-hidden />
                  {t.nav[item.key]}
                </Link>
              )
            })}
            <label className="flex items-center gap-1 text-sm text-gray-900 ml-2">
              <span className="sr-only">{t.nav.language}</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'en' | 'es')}
                className="border border-gray-300 text-gray-900 bg-white text-sm py-1 px-2"
                aria-label={t.nav.language}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
            {session ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="ml-2 px-3 py-2 text-sm border border-gray-300 text-gray-900 hover:bg-gray-50"
              >
                {t.nav.signOut}
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div
            id="mobile-nav-menu"
            className="lg:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon size={20} className="mr-3 shrink-0" aria-hidden />
                    {t.nav[item.key]}
                  </Link>
                )
              })}
              <div className="px-4 pt-2">
                <label className="flex flex-col gap-1 text-sm text-gray-900">
                  {t.nav.language}
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as 'en' | 'es')}
                    className="border border-gray-300 text-gray-900 bg-white py-2 px-2"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </label>
              </div>
              {session ? (
                <button
                  type="button"
                  className="mx-4 mt-2 px-3 py-2 text-sm border border-gray-300 text-gray-900 text-left hover:bg-gray-50"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  {t.nav.signOut}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
