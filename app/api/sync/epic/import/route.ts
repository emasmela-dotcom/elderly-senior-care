import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'
import { getMedicationColumnMap } from '@/lib/schemaCompat'
import { importAppointmentRows } from '@/lib/sync/importAppointments'

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
  const accessToken = cookieStore.get('epic_access_token')?.value
  const patientId = cookieStore.get('epic_patient_id')?.value

  if (!accessToken || !patientId) {
    return NextResponse.json(
      { error: 'Not connected to MyChart. Please connect first.' },
      { status: 401 }
    )
  }

  const fhirBase = process.env.EPIC_FHIR_BASE_URL?.trim()?.replace(/\/$/, '')
  if (!fhirBase) {
    return NextResponse.json({ error: 'EPIC_FHIR_BASE_URL is not configured.' }, { status: 503 })
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/fhir+json',
  }

  try {
    const [medRes, apptRes] = await Promise.all([
      fetch(`${fhirBase}/MedicationRequest?patient=${patientId}`, { headers }),
      fetch(`${fhirBase}/Appointment?patient=${patientId}`, { headers }),
    ])

    const medBundle = medRes.ok
      ? ((await medRes.json()) as { entry?: { resource?: Record<string, unknown> }[] })
      : { entry: [] }
    const apptBundle = apptRes.ok
      ? ((await apptRes.json()) as { entry?: { resource?: Record<string, unknown> }[] })
      : { entry: [] }

    const sql = getSql()
    const cols = await getMedicationColumnMap(sql)
    let medsImported = 0
    let medsSkipped = 0

    for (const entry of medBundle.entry ?? []) {
      const resource = entry.resource
      if (!resource?.id) continue
      const name =
        (resource.medicationCodeableConcept as { text?: string })?.text ??
        'Medication'
      const dosage =
        (
          (resource.dosageInstruction as { text?: string }[])?.[0] as
            | { text?: string }
            | undefined
        )?.text ?? ''

      const existing = await sql`
        SELECT id FROM medications
        WHERE resident_id = ${resident_id}::uuid AND notes LIKE ${`%[epic:${resource.id}]%`}
        LIMIT 1
      `
      if ((existing as unknown[]).length > 0) {
        medsSkipped++
        continue
      }

      const notes = `[epic:${resource.id}]`
      if (cols.times === 'times_json') {
        await sql`
          INSERT INTO medications (resident_id, name, dosage, frequency, times_json, notes)
          VALUES (${resident_id}::uuid, ${String(name).slice(0, 200)}, ${dosage.slice(0, 200)}, '', '[]', ${notes})
        `
      } else {
        await sql`
          INSERT INTO medications (resident_id, name, dosage, frequency, times, notes)
          VALUES (${resident_id}::uuid, ${String(name).slice(0, 200)}, ${dosage.slice(0, 200)}, '', '[]', ${notes})
        `
      }
      medsImported++
    }

    const apptRows = (apptBundle.entry ?? [])
      .map((entry) => {
        const resource = entry.resource
        if (!resource?.id) return null
        const start = String(resource.start ?? '')
        const dt = new Date(start)
        if (Number.isNaN(dt.getTime())) return null
        const participants =
          (resource.participant as { actor?: { display?: string } }[]) ?? []
        const doctor =
          participants.find((p) => p.actor?.display)?.actor?.display ?? 'MyChart'
        return {
          dedupeTag: `[epic:${resource.id}]`,
          type: String(resource.description ?? 'Appointment').slice(0, 200),
          doctor_name: doctor.slice(0, 200),
          appt_date: dt.toISOString().slice(0, 10),
          appt_time: dt.toTimeString().slice(0, 5),
          location: null,
          notes: `[epic:${resource.id}]`,
        }
      })
      .filter(Boolean) as Parameters<typeof importAppointmentRows>[1]

    const apptResult = await importAppointmentRows(sql, apptRows)

    return NextResponse.json({
      medications: { imported: medsImported, skipped: medsSkipped },
      appointments: apptResult,
    })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
