export type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'anytime'

export const PERIOD_LABELS: Record<DayPeriod, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  anytime: 'Anytime today',
}

export function parseTimeToMinutes(value: string): number | null {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed) return null

  if (trimmed.includes('morning') || trimmed.includes('breakfast')) return 8 * 60
  if (trimmed.includes('noon') || trimmed.includes('lunch') || trimmed.includes('afternoon')) {
    return 14 * 60
  }
  if (
    trimmed.includes('evening') ||
    trimmed.includes('night') ||
    trimmed.includes('bed') ||
    trimmed.includes('dinner')
  ) {
    return 20 * 60
  }

  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/)
  if (match24) {
    const hours = Number(match24[1])
    const minutes = Number(match24[2])
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return hours * 60 + minutes
    }
  }

  const match12 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/)
  if (match12) {
    let hours = Number(match12[1]) % 12
    const minutes = match12[2] ? Number(match12[2]) : 0
    if (match12[3] === 'pm') hours += 12
    return hours * 60 + minutes
  }

  return null
}

export function periodForMinutes(minutes: number): Exclude<DayPeriod, 'anytime'> {
  if (minutes < 12 * 60) return 'morning'
  if (minutes < 17 * 60) return 'afternoon'
  return 'evening'
}

export function periodsForMedicationTimes(times: string[]): DayPeriod[] {
  if (!times.length) return ['anytime']

  const periods = new Set<Exclude<DayPeriod, 'anytime'>>()
  for (const time of times) {
    const minutes = parseTimeToMinutes(time)
    if (minutes == null) continue
    periods.add(periodForMinutes(minutes))
  }

  if (periods.size === 0) return ['anytime']
  return Array.from(periods)
}

export function formatTimeLabel(time: string): string {
  const minutes = parseTimeToMinutes(time)
  if (minutes == null) return time
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`
}
