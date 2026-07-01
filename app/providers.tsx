'use client'

import { SessionProvider } from 'next-auth/react'
import { I18nProvider } from '@/components/I18nProvider'
import { LargeTextProvider } from '@/components/LargeTextProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LargeTextProvider>
        <I18nProvider>{children}</I18nProvider>
      </LargeTextProvider>
    </SessionProvider>
  )
}
