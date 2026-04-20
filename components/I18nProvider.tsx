'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { Messages } from '@/locales/en'
import { en } from '@/locales/en'
import { es } from '@/locales/es'

type Locale = 'en' | 'es'

const dictionaries: Record<Locale, Messages> = { en, es }

const I18nContext = createContext<{
  locale: Locale
  t: Messages
  setLocale: (l: Locale) => void
} | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const t = useMemo(() => dictionaries[locale], [locale])
  const set = useCallback((l: Locale) => setLocale(l), [])
  const value = useMemo(
    () => ({ locale, t, setLocale: set }),
    [locale, t, set]
  )
  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    return { locale: 'en' as const, t: en, setLocale: () => {} }
  }
  return ctx
}
