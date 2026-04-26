'use client'

import { useI18n } from '@/components/I18nProvider'

export function SkipLink() {
  const { t } = useI18n()
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-garden focus:border focus:border-garden-sage-600 focus:bg-garden-cream focus:px-4 focus:py-2 focus:text-garden-wood focus:shadow-garden"
    >
      {t.skip}
    </a>
  )
}
