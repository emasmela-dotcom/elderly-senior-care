import { parseIcsEvents } from '@/lib/sync/parseIcs'

export function readUploadText(file: File, maxBytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > maxBytes) {
      reject(new Error(`File is too large. Maximum size is ${Math.round(maxBytes / 1024 / 1024)}MB.`))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Could not read file.'))
    reader.readAsText(file)
  })
}

export function extractIcsFromText(text: string): string {
  const trimmed = text.trim()
  if (trimmed.includes('BEGIN:VCALENDAR')) return trimmed

  const embedded = trimmed.match(/BEGIN:VCALENDAR[\s\S]*END:VCALENDAR/)
  if (embedded?.[0]) return embedded[0]

  return trimmed
}

export function parseCalendarFileText(text: string, sourceTag: 'apple' | 'email') {
  const ics = extractIcsFromText(text)
  return parseIcsEvents(ics, { sourceTag })
}
