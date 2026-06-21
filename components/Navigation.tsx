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
      className="relative z-20 border-b border-care-border bg-care-background/95 shadow-garden backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 py-3 min-h-[4rem]">
          <Link
            href="/"
            className="font-display text-xl sm:text-2xl font-semibold text-care-text whitespace-nowrap shrink-0 tracking-tight"
          >
            {t.brand}
            <span className="ml-2 inline-flex items-center rounded-full border border-care-glow/40 bg-care-glow/10 px-2 py-0.5 text-xs font-sans font-semibold tracking-wide text-care-primary">
              24/7
            </span>
          </Link>

          <div className="hidden lg:flex items-center justify-end gap-2">
            <label className="ml-2 flex items-center gap-1 text-sm text-care-muted">
              <span className="sr-only">{t.nav.language}</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'en' | 'es')}
                className="garden-field py-1 pl-2 pr-6 text-sm"
                aria-label={t.nav.language}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </label>
            {session ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="garden-btn-outline px-3 py-2"
              >
                {t.nav.signOut}
              </button>
            ) : (
              <Link href="/login" className="garden-btn-outline px-3 py-2">
                {t.nav.signIn}
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="shrink-0 rounded-garden border border-care-border p-2 text-care-text transition-colors hover:bg-care-hover lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
          </button>
        </div>

        <div className="hidden lg:block border-t border-care-border pb-3 pt-2">
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
                        ? 'bg-care-primary text-white shadow-sm'
                        : 'text-care-text hover:bg-care-hover'
                    )}
                  >
                    <Icon
                      size={16}
                      className={clsx('mr-2 shrink-0', isActive ? 'text-white' : 'text-care-secondary')}
                      aria-hidden
                    />
                    {t.nav[item.key]}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div id="mobile-nav-menu" className="border-t border-care-border py-4 lg:hidden">
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
                      isActive ? 'bg-care-primary text-white' : 'text-care-text hover:bg-care-hover'
                    )}
                  >
                    <Icon
                      size={20}
                      className={clsx('mr-3 shrink-0', isActive ? 'text-white' : 'text-care-secondary')}
                      aria-hidden
                    />
                    {t.nav[item.key]}
                  </Link>
                )
              })}
              <div className="px-4 pt-2">
                <label className="flex flex-col gap-1 text-sm text-care-muted">
                  {t.nav.language}
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as 'en' | 'es')}
                    className="garden-field py-2"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </label>
              </div>
              {session ? (
                <button
                  type="button"
                  className="mx-4 mt-2 garden-btn-outline text-left"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  {t.nav.signOut}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="mx-4 mt-2 garden-btn-outline inline-block text-left"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.nav.signIn}
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
