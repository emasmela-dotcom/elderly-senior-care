export type ParsedPharmacyMed = {
  name: string
  dosage: string
  frequency: string
  notes: string
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (ch === ',' && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }
    current += ch
  }
  cells.push(current.trim())
  return cells
}

function pickColumn(headers: string[], patterns: string[]): number {
  const lower = headers.map((h) => h.toLowerCase())
  for (const pattern of patterns) {
    const idx = lower.findIndex((h) => h.includes(pattern))
    if (idx >= 0) return idx
  }
  return -1
}

export function parsePharmacyCsv(csvText: string): ParsedPharmacyMed[] {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headers = splitCsvLine(lines[0] ?? '')
  const nameIdx = pickColumn(headers, ['drug', 'medication', 'medicine', 'name', 'rx'])
  const doseIdx = pickColumn(headers, ['dosage', 'dose', 'strength', 'quantity'])
  const freqIdx = pickColumn(headers, ['frequency', 'freq', 'schedule', 'refill'])
  if (nameIdx < 0) return []

  const meds: ParsedPharmacyMed[] = []
  for (const line of lines.slice(1)) {
    const cells = splitCsvLine(line)
    const name = (cells[nameIdx] ?? '').trim()
    if (!name) continue
    meds.push({
      name: name.slice(0, 200),
      dosage: doseIdx >= 0 ? (cells[doseIdx] ?? '').slice(0, 200) : '',
      frequency: freqIdx >= 0 ? (cells[freqIdx] ?? '').slice(0, 200) : '',
      notes: '[pharmacy:csv]',
    })
  }
  return meds
}
