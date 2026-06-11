'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Calendar,
  FileText,
  Menu,
  X,
  Users,
  Pill,
  ClipboardList,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useI18n } from '@/components/I18nProvider'
import type { NavKey } from '@/locales/en'

const navigation: { key: NavKey; href: string; icon: typeof Pill }[] = [
  { key: 'medications', href: '/medications', icon: Pill },
  { key: 'appointments', href: '/appointments', icon: Calendar },
  { key: 'myHealth', href: '/health-records', icon: FileText },
  { key: 'myPeople', href: '/family', icon: Users },
  { key: 'schedule', href: '/schedules', icon: ClipboardList },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { t, locale, setLocale } = useI18n()

  return (
    <nav
      className="relative z-20 border-b border-[#d6d0c3] bg-[#f9f6f0]/95 shadow-garden backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 py-3 min-h-[4rem]">
          <Link
            href="/"
            className="font-display text-xl sm:text-2xl font-semibold text-[#1a1a1a] whitespace-nowrap shrink-0 tracking-tight"
          >
            {t.brand}
          </Link>

          <div className="hidden lg:flex items-center justify-end gap-2">
            <label className="ml-2 flex items-center gap-1 text-sm text-garden-wood">
              <span className="sr-only">{t.nav.language}</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'en' | 'es')}
                className="rounded-garden border border-[#c8b8a6] bg-white/90 py-1 pl-2 pr-6 text-sm text-[#1a1a1a] shadow-garden-inner"
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
                className="rounded-garden border border-[#c8b8a6] bg-white/80 px-3 py-2 text-sm text-[#1a1a1a] transition-colors hover:bg-[#eef4f6]"
              >
                {t.nav.signOut}
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="shrink-0 rounded-garden border border-[#c8b8a6] p-2 text-[#1a1a1a] transition-colors hover:bg-[#eef4f6] lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>

        <div className="hidden lg:block border-t border-[#d6d0c3] pb-3 pt-2">
          <div className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-2 pr-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'inline-flex items-center whitespace-nowrap rounded-garden px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#4A8FA8] text-white shadow-sm'
                        : 'text-[#1a1a1a] hover:bg-[#eef4f6]'
                    )}
                  >
                    <Icon size={16} className={clsx('mr-2 shrink-0', isActive ? 'text-white' : 'text-[#6B8F71]')} aria-hidden />
                    {t.nav[item.key]}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div
            id="mobile-nav-menu"
            className="border-t border-[#d6d0c3] py-4 lg:hidden"
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
                      'flex items-center rounded-garden px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#4A8FA8] text-white'
                        : 'text-[#1a1a1a] hover:bg-[#eef4f6]'
                    )}
                  >
                    <Icon size={20} className={clsx('mr-3 shrink-0', isActive ? 'text-white' : 'text-[#6B8F71]')} aria-hidden />
                    {t.nav[item.key]}
                  </Link>
                )
              })}
              <div className="px-4 pt-2">
                <label className="flex flex-col gap-1 text-sm text-garden-wood">
                  {t.nav.language}
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as 'en' | 'es')}
                    className="w-full rounded-garden border border-[#c8b8a6] bg-white/90 px-3 py-2 text-[#1a1a1a] shadow-garden-inner focus:border-[#4A8FA8] focus:ring-2 focus:ring-[#4A8FA8]/40"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </label>
              </div>
              {session ? (
                <button
                  type="button"
                  className="mx-4 mt-2 rounded-garden border border-[#c8b8a6] bg-white/80 px-3 py-2 text-left text-sm text-[#1a1a1a] hover:bg-[#eef4f6]"
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
