'use client'

import { Download } from 'lucide-react'
import { downloadJsonFile } from '@/lib/downloadJson'

type Props = {
  filename: string
  data: unknown
  label?: string
  variant?: 'light' | 'dark'
}

export function DownloadJsonButton({
  filename,
  data,
  label = 'Download',
  variant = 'light',
}: Props) {
  const className =
    variant === 'dark'
      ? 'flex items-center px-3 py-1.5 border border-white text-white bg-transparent hover:bg-garden-sage-900 transition-colors text-sm'
      : 'flex items-center px-4 py-2 border border-garden-clay-200/85 text-garden-wood bg-white hover:bg-garden-sage-50/70 transition-colors'

  return (
    <button
      type="button"
      onClick={() => downloadJsonFile(filename, data)}
      className={className}
    >
      <Download size={20} className="mr-2 shrink-0" aria-hidden />
      {label}
    </button>
  )
}
