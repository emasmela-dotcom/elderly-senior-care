export type ParsedIcsEvent = {
  uid: string
  type: string
  doctor_name: string
  appt_date: string
  appt_time: string | null
  location: string | null
  notes: string
}

function unfoldIcs(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '')
}

function parseIcsDate(raw: string): { date: string; time: string | null; dt: Date } | null {
  const trimmed = raw.trim()
  if (/^\d{8}$/.test(trimmed)) {
    const date = `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`
    return { date, time: null, dt: new Date(`${date}T12:00:00`) }
  }
  const m = trimmed.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/)
  if (!m) return null
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}${m[7] ? 'Z' : ''}`
  const dt = new Date(iso)
  if (Number.isNaN(dt.getTime())) return null
  return {
    date: dt.toISOString().slice(0, 10),
    time: dt.toTimeString().slice(0, 5),
    dt,
  }
}

function readFields(block: string): Map<string, string> {
  const fields = new Map<string, string>()
  for (const line of block.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const rawKey = line.slice(0, idx)
    const key = rawKey.split(';')[0]?.toUpperCase() ?? rawKey.toUpperCase()
    fields.set(key, line.slice(idx + 1).trim())
  }
  return fields
}

export function parseIcsEvents(
  icsText: string,
  opts?: { daysAhead?: number; fromDate?: Date; sourceTag?: string }
): ParsedIcsEvent[] {
  const daysAhead = opts?.daysAhead ?? 90
  const sourceTag = opts?.sourceTag ?? 'apple'
  const from = opts?.fromDate ?? new Date()
  from.setHours(0, 0, 0, 0)
  const max = new Date(from.getTime() + daysAhead * 24 * 60 * 60 * 1000)
  const unfolded = unfoldIcs(icsText)
  const events: ParsedIcsEvent[] = []

  for (const block of unfolded.split('BEGIN:VEVENT').slice(1)) {
    if (!block.includes('END:VEVENT')) continue
    const chunk = block.split('END:VEVENT')[0] ?? ''
    const fields = readFields(chunk)
    const uid = fields.get('UID')
    const startRaw = fields.get('DTSTART')
    if (!uid || !startRaw) continue

    const parsed = parseIcsDate(startRaw)
    if (!parsed) continue
    if (parsed.dt < from || parsed.dt > max) continue

    const status = (fields.get('STATUS') ?? '').toUpperCase()
    if (status === 'CANCELLED') continue

    const summary = fields.get('SUMMARY') ?? 'Calendar Event'
    const description = fields.get('DESCRIPTION') ?? ''
    const location = fields.get('LOCATION') ?? null
    const organizer = fields.get('ORGANIZER') ?? ''
    const doctor =
      organizer.replace(/^mailto:/i, '').split('@')[0]?.replace(/\./g, ' ') ||
      'Calendar'

    const baseNotes = description.slice(0, 800)
    const notes = baseNotes ? `${baseNotes}\n[${sourceTag}:${uid}]` : `[${sourceTag}:${uid}]`

    events.push({
      uid,
      type: summary.slice(0, 200),
      doctor_name: doctor.slice(0, 200),
      appt_date: parsed.date,
      appt_time: parsed.time,
      location: location?.slice(0, 300) ?? null,
      notes,
    })
  }

  return events
}
