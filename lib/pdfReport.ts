import { jsPDF } from 'jspdf'

export function buildResidentsPdfBlob(
  rows: { full_name: string; room_number?: string | null; notes?: string | null }[]
) {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text('CareConnect — Residents', 14, 18)
  doc.setFontSize(10)
  let y = 30
  const pageMax = 285
  for (const r of rows.slice(0, 80)) {
    const line = `${r.full_name}${r.room_number ? ` — Room ${r.room_number}` : ''}`
    doc.text(line, 14, y)
    y += 6
    if (y > pageMax) {
      doc.addPage()
      y = 18
    }
  }
  return doc.output('blob')
}
