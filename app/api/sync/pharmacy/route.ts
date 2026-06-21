import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'

/**
 * PHASE 2 — Pharmacy & MyChart Integration
 *
 * CVS / Walgreens / Rite Aid:
 *   - No public APIs available from any major US pharmacy chain.
 *   - Best practical path: accept CSV export from pharmacy account portal.
 *   - CVS: Account → Prescription History → Export
 *   - TODO: Accept CSV upload, parse with papaparse (already in package.json via recharts dep)
 *   - Map columns: Drug Name → name, Quantity/Strength → dosage, Refill Frequency → frequency
 *   - Insert into medications table with resident_id selected by user on import UI
 *
 * MyChart / Epic (SMART on FHIR):
 *   - Register at https://fhir.epic.com/ (free for non-commercial)
 *   - SMART on FHIR OAuth 2.0 — similar flow to Google OAuth
 *   - Scopes: patient/MedicationRequest.read  patient/Appointment.read
 *   - FHIR R4 base URL varies by health system (e.g. https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4)
 *   - MedicationRequest.medicationCodeableConcept.text → medications.name
 *   - MedicationRequest.dosageInstruction[0].text     → medications.dosage
 *   - Appointment.start                               → appointments.appt_date / appt_time
 *   - Appointment.participant[].actor.display         → appointments.doctor_name
 *   - TODO: Add EPIC_CLIENT_ID to .env.example
 *   - TODO: Store FHIR base URL per user (varies by health system)
 *
 * Surescripts (long-term):
 *   - Requires pharmacy benefit manager partnership agreement — not viable for indie.
 *
 * Recommended Phase 2 order: CSV upload → Epic FHIR → CVS screen-scrape (last resort).
 */
export async function POST() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  return NextResponse.json(
    { error: 'Pharmacy sync is not yet available. Coming soon.' },
    { status: 501 }
  )
}
