import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/requireAuth'

/**
 * PHASE 2 — Apple Health / Google Fit Vitals Import
 *
 * Apple Health:
 *   - No public REST API. All data lives on-device.
 *   - User exports from Health app → Share → Export All Health Data → .zip
 *   - Inside: export.xml with HealthKit Record elements
 *   - TODO: Accept .zip upload, extract export.xml, parse with fast-xml-parser
 *   - Key record types to map to vital_signs table:
 *       HKQuantityTypeIdentifierHeartRate          → heart_rate
 *       HKQuantityTypeIdentifierBloodPressureSystolic  → blood_pressure_systolic
 *       HKQuantityTypeIdentifierBloodPressureDiastolic → blood_pressure_diastolic
 *       HKQuantityTypeIdentifierBodyMass           → weight
 *       HKQuantityTypeIdentifierBloodGlucose       → glucose
 *       HKQuantityTypeIdentifierBodyTemperature    → temperature
 *
 * Google Fit:
 *   - REST API: https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate
 *   - Additional OAuth scopes needed (add to connect route):
 *       https://www.googleapis.com/auth/fitness.heart_rate.read
 *       https://www.googleapis.com/auth/fitness.blood_pressure.read
 *       https://www.googleapis.com/auth/fitness.body.read
 *   - dataTypeName mapping:
 *       com.google.heart_rate.bpm         → heart_rate
 *       com.google.blood_pressure         → blood_pressure_systolic/diastolic
 *       com.google.weight                 → weight (convert kg → lb if needed)
 *       com.google.blood_glucose.mmol_per_liter → glucose
 *
 * Target table: vital_signs (see db/schema.sql)
 * All inserts need resident_id — prompt user to select resident on import UI.
 */
export async function POST() {
  const auth = await requireSession()
  if (!auth.ok) return auth.response

  return NextResponse.json(
    { error: 'Health vitals sync is not yet available. Coming soon.' },
    { status: 501 }
  )
}
