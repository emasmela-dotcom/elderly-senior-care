'use client'

import { FileSpreadsheet } from 'lucide-react'
import { rowsToCsv } from '@/lib/csv'
import { downloadBlob } from '@/lib/browserDownload'

type Props = {
  filename: string
  headers: string[]
  rows: (string | number | null | undefined)[][]
  label?: string
}

export function ExportCsvButton({
  filename,
  headers,
  rows,
  label = 'Download CSV',
}: Props) {
  return (
    <button
      type="button"
      onClick={() => {
        const csv = rowsToCsv(headers, rows)
        downloadBlob(
          filename.endsWith('.csv') ? filename : `${filename}.csv`,
          new Blob([csv], { type: 'text/csv;charset=utf-8' })
        )
      }}
      className="flex items-center px-4 py-2 border border-garden-clay-200/85 text-garden-wood bg-white hover:bg-garden-sage-50/70 transition-colors"
    >
      <FileSpreadsheet size={20} className="mr-2 shrink-0" aria-hidden />
      {label}
    </button>
  )
}
