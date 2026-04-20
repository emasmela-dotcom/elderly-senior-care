'use client'

import { useI18n } from '@/components/I18nProvider'

export function SkipLink() {
  const { t } = useI18n()
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-gray-900 focus:border focus:border-gray-900"
    >
      {t.skip}
    </a>
  )
}
