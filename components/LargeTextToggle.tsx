'use client'

import { Type } from 'lucide-react'
import { useLargeText } from '@/components/LargeTextProvider'

export function LargeTextToggle({ className = '' }: { className?: string }) {
  const { largeText, toggleLargeText } = useLargeText()

  return (
    <button
      type="button"
      onClick={toggleLargeText}
      className={`garden-btn-outline px-3 py-2 gap-2 ${className}`}
      aria-pressed={largeText}
      title={largeText ? 'Switch to normal text size' : 'Switch to large text'}
    >
      <Type size={18} className="shrink-0" aria-hidden />
      <span className="whitespace-nowrap">{largeText ? 'Normal text' : 'Large text'}</span>
    </button>
  )
}
