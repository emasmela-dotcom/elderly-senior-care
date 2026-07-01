const prefix = 'careconnect-med-taken'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function storageKey(): string {
  return `${prefix}-${todayKey()}`
}

export function medTakenKey(medicationId: string, timeLabel: string): string {
  return `${medicationId}@${timeLabel}`
}

export function readTakenToday(): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(storageKey())
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, boolean>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function writeTakenToday(map: Record<string, boolean>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey(), JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function setMedTaken(key: string, taken: boolean): Record<string, boolean> {
  const next = { ...readTakenToday(), [key]: taken }
  writeTakenToday(next)
  return next
}
