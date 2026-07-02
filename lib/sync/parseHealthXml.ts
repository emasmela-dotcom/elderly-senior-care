export type ParsedHealthVital = {
  recorded_at: string
  heart_rate: number | null
  blood_pressure_systolic: number | null
  blood_pressure_diastolic: number | null
  weight: number | null
  glucose: number | null
  temperature: number | null
  sourceTag: string
}

const TYPE_MAP: Record<
  string,
  keyof Omit<ParsedHealthVital, 'recorded_at' | 'sourceTag'>
> = {
  HKQuantityTypeIdentifierHeartRate: 'heart_rate',
  HKQuantityTypeIdentifierBloodPressureSystolic: 'blood_pressure_systolic',
  HKQuantityTypeIdentifierBloodPressureDiastolic: 'blood_pressure_diastolic',
  HKQuantityTypeIdentifierBodyMass: 'weight',
  HKQuantityTypeIdentifierBloodGlucose: 'glucose',
  HKQuantityTypeIdentifierBodyTemperature: 'temperature',
}

function parseAppleDate(raw: string): string | null {
  const dt = new Date(raw.trim())
  if (Number.isNaN(dt.getTime())) return null
  return dt.toISOString()
}

export function parseAppleHealthXml(
  xmlText: string,
  opts?: { maxRecords?: number; daysBack?: number }
): ParsedHealthVital[] {
  const maxRecords = opts?.maxRecords ?? 500
  const daysBack = opts?.daysBack ?? 90
  const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000

  const byTime = new Map<string, ParsedHealthVital>()
  const recordRe =
    /<Record\b[^>]*type="([^"]+)"[^>]*(?:value="([^"]*)")?[^>]*(?:startDate="([^"]*)")?[^>]*\/?>/gi

  let match: RegExpExecArray | null
  let count = 0
  while ((match = recordRe.exec(xmlText)) !== null && count < maxRecords * 4) {
    count++
    const type = match[1] ?? ''
    const field = TYPE_MAP[type]
    if (!field) continue

    const valueRaw = match[2]
    const dateRaw = match[3]
    if (!valueRaw || !dateRaw) continue

    const recorded_at = parseAppleDate(dateRaw)
    if (!recorded_at) continue
    if (new Date(recorded_at).getTime() < cutoff) continue

    const value = Number(valueRaw)
    if (Number.isNaN(value)) continue

    const bucket = recorded_at.slice(0, 16)
    const existing =
      byTime.get(bucket) ??
      ({
        recorded_at,
        heart_rate: null,
        blood_pressure_systolic: null,
        blood_pressure_diastolic: null,
        weight: null,
        glucose: null,
        temperature: null,
        sourceTag: `[health:apple:${bucket}]`,
      } satisfies ParsedHealthVital)

    existing[field] = value
    byTime.set(bucket, existing)
  }

  return Array.from(byTime.values()).slice(0, maxRecords)
}
