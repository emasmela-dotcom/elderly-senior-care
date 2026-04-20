'use client'

import { FileText } from 'lucide-react'
import { buildResidentsPdfBlob } from '@/lib/pdfReport'
import { downloadBlob } from '@/lib/browserDownload'

type ResidentRow = {
  full_name: string
  room_number?: string | null
  notes?: string | null
}

type Props = {
  filename?: string
  residents: ResidentRow[]
  label?: string
}

export function ExportResidentsPdfButton({
  filename = 'residents.pdf',
  residents,
  label = 'Download PDF',
}: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        const blob = buildResidentsPdfBlob(residents)
        downloadBlob(filename, blob)
      }}
      className="flex items-center px-4 py-2 border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 transition-colors"
    >
      <FileText size={20} className="mr-2 shrink-0" aria-hidden />
      {label}
    </button>
  )
}
