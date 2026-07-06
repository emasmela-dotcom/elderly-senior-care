import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'
import { dbErrorResponse } from '@/lib/dbError'
import { familyReadOnlyGuard, requireSession } from '@/lib/requireAuth'

export async function GET() {
  const auth = await requireSession()
  if (auth.ok === false) return auth.response

  const guard = familyReadOnlyGuard(auth.session, 'GET')
  if (guard) return guard

  try {
    const sql = getSql()
    const today = new Date().toISOString().slice(0, 10)

    const [meds, apts, aptsTotal, people, schedules] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM medications`,
      sql`SELECT COUNT(*)::int AS count FROM appointments WHERE appt_date = ${today}::date`,
      sql`SELECT COUNT(*)::int AS count FROM appointments`,
      sql`SELECT COUNT(*)::int AS count FROM caregivers`,
      sql`
        SELECT COUNT(*)::int AS count FROM schedules
        WHERE start_date IS NULL OR start_date >= ${today}::date
      `,
    ])

    return NextResponse.json({
      medicationsCount: (meds[0] as { count: number }).count,
      appointmentsToday: (apts[0] as { count: number }).count,
      appointmentsTotal: (aptsTotal[0] as { count: number }).count,
      peopleCount: (people[0] as { count: number }).count,
      scheduleItems: (schedules[0] as { count: number }).count,
    })
  } catch (e) {
    return dbErrorResponse(e)
  }
}
