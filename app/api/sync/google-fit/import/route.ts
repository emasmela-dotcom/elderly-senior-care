import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { refreshGoogleAccessToken } from '@/lib/sync/googleOAuth'

const AGGREGATE_URL =
  'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'

type FitBucket = {
  startTimeMillis?: string
  dataset?: { point?: { value?: { fpVal?: number; intVal?: number }[] }[] }[]
}

async function aggregateFit(
  accessToken: string,
  dataTypeName: string,
  startMs: number,
  endMs: number
): Promise<FitBucket[]> {
  const res = await fetch(AGGREGATE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      aggregateBy: [{ dataTypeName }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: startMs,
      endTimeMillis: endMs,
    }),
  })
  if (!res.ok) return []
  const data = (await res.json()) as { bucket?: FitBucket[] }
  return data.bucket ?? []
}

function bucketValue(bucket: FitBucket): number | null {
  const point = bucket.dataset?.[0]?.point?.[0]?.value?.[0]
  const val = point?.fpVal ?? point?.intVal
  return val != null ? Number(val) : null
}

export async function POST(req: Request) {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response

  const guard = familyReadOnlyGuard(auth.session, 'POST')
  if (guard) return guard

  const body = await req.json().catch(() => ({}))
  const resident_id = String((body as { resident_id?: string }).resident_id ?? '').trim()
  if (!resident_id) {
    return NextResponse.json({ error: 'resident_id required' }, { status: 400 })
  }

  const cookieStore = await cookies()
  let accessToken = cookieStore.get('gfit_access_token')?.value
  const refreshToken = cookieStore.get('gfit_refresh_token')?.value

  if (!accessToken && refreshToken) {
    accessToken = (await refreshGoogleAccessToken(refreshToken)) ?? undefined
  }
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not connected to Google Fit. Please connect first.' },
      { status: 401 }
    )
  }

  try {
    const endMs = Date.now()
    const startMs = endMs - 90 * 24 * 60 * 60 * 1000

    const [hrBuckets, sysBuckets, diaBuckets, weightBuckets, glucoseBuckets] =
      await Promise.all([
        aggregateFit(accessToken, 'com.google.heart_rate.bpm', startMs, endMs),
        aggregateFit(accessToken, 'com.google.blood_pressure.systolic', startMs, endMs),
        aggregateFit(accessToken, 'com.google.blood_pressure.diastolic', startMs, endMs),
        aggregateFit(accessToken, 'com.google.weight', startMs, endMs),
        aggregateFit(accessToken, 'com.google.blood_glucose', startMs, endMs),
      ])

    const byDay = new Map<
      string,
      {
        recorded_at: string
        heart_rate: number | null
        blood_pressure_systolic: number | null
        blood_pressure_diastolic: number | null
        weight: number | null
        glucose: number | null
      }
    >()

    type VitalRow = {
      recorded_at: string
      heart_rate: number | null
      blood_pressure_systolic: number | null
      blood_pressure_diastolic: number | null
      weight: number | null
      glucose: number | null
    }

    function merge(
      buckets: FitBucket[],
      field: keyof Omit<VitalRow, 'recorded_at'>
    ) {
      for (const bucket of buckets) {
        const ms = Number(bucket.startTimeMillis ?? 0)
        if (!ms) continue
        const recorded_at = new Date(ms).toISOString()
        const key = recorded_at.slice(0, 10)
        const row = byDay.get(key) ?? {
          recorded_at,
          heart_rate: null,
          blood_pressure_systolic: null,
          blood_pressure_diastolic: null,
          weight: null,
          glucose: null,
        }
        const val = bucketValue(bucket)
        if (val != null) row[field] = val
        byDay.set(key, row)
      }
    }

    merge(hrBuckets, 'heart_rate')
    merge(sysBuckets, 'blood_pressure_systolic')
    merge(diaBuckets, 'blood_pressure_diastolic')
    merge(weightBuckets, 'weight')
    merge(glucoseBuckets, 'glucose')

    const sql = getSql()
    let imported = 0
    let skipped = 0

    for (const row of byDay.values()) {
      const existing = await sql`
        SELECT id FROM vital_signs
        WHERE resident_id = ${resident_id}::uuid
          AND recorded_at::date = ${row.recorded_at.slice(0, 10)}::date
          AND recorded_by = 'Google Fit import'
        LIMIT 1
      `
      if ((existing as unknown[]).length > 0) {
        skipped++
        continue
      }

      await sql`
        INSERT INTO vital_signs (
          resident_id, recorded_at, blood_pressure_systolic, blood_pressure_diastolic,
          heart_rate, temperature, weight, glucose, recorded_by
        ) VALUES (
          ${resident_id}::uuid, ${row.recorded_at}::timestamptz,
          ${row.blood_pressure_systolic}, ${row.blood_pressure_diastolic},
          ${row.heart_rate}, NULL, ${row.weight}, ${row.glucose},
          'Google Fit import'
        )
      `
      imported++
    }

    return NextResponse.json({ imported, skipped, total: byDay.size })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
