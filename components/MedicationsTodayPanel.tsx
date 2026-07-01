'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import {
  PERIOD_LABELS,
  type DayPeriod,
  formatTimeLabel,
  parseTimeToMinutes,
  periodForMinutes,
} from '@/lib/medicationTimes'
import { medTakenKey, readTakenToday, setMedTaken } from '@/lib/medTakenStorage'

export interface TodayMedication {
  id: string
  name: string
  dosage: string
  times: string[]
  photoUrl?: string
}

const PERIOD_ORDER: DayPeriod[] = ['morning', 'afternoon', 'evening', 'anytime']

type TodayDose = {
  key: string
  medicationId: string
  name: string
  dosage: string
  timeLabel: string
  period: DayPeriod
  photoUrl?: string
}

function buildTodayDoses(medications: TodayMedication[]): TodayDose[] {
  const doses: TodayDose[] = []

  for (const med of medications) {
    if (!med.times?.length) {
      doses.push({
        key: medTakenKey(med.id, 'anytime'),
        medicationId: med.id,
        name: med.name,
        dosage: med.dosage,
        timeLabel: 'Anytime',
        period: 'anytime',
        photoUrl: med.photoUrl,
      })
      continue
    }

    for (const time of med.times) {
      const minutes = parseTimeToMinutes(time)
      const period =
        minutes == null ? ('anytime' as DayPeriod) : periodForMinutes(minutes)
      doses.push({
        key: medTakenKey(med.id, time),
        medicationId: med.id,
        name: med.name,
        dosage: med.dosage,
        timeLabel: formatTimeLabel(time),
        period,
        photoUrl: med.photoUrl,
      })
    }
  }

  return doses
}

export function MedicationsTodayPanel({ medications }: { medications: TodayMedication[] }) {
  const [taken, setTaken] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setTaken(readTakenToday())
  }, [])

  const doses = useMemo(() => buildTodayDoses(medications), [medications])

  const grouped = useMemo(() => {
    const map = new Map<DayPeriod, TodayDose[]>()
    for (const period of PERIOD_ORDER) map.set(period, [])
    for (const dose of doses) {
      map.get(dose.period)?.push(dose)
    }
    return PERIOD_ORDER.filter((p) => (map.get(p)?.length ?? 0) > 0).map((period) => ({
      period,
      items: map.get(period) ?? [],
    }))
  }, [doses])

  if (medications.length === 0) return null

  function toggleDose(key: string) {
    setTaken((prev) => setMedTaken(key, !prev[key]))
  }

  const takenCount = doses.filter((d) => taken[d.key]).length

  return (
    <section className="mb-8" aria-labelledby="meds-today-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="meds-today-heading" className="text-2xl font-bold text-garden-wood md:text-3xl">
            What&apos;s due today?
          </h2>
          <p className="mt-1 text-base text-garden-wood/75">
            Tap each dose when you have taken it.
          </p>
        </div>
        {doses.length > 0 ? (
          <p className="text-base font-medium text-care-primary" role="status">
            {takenCount} of {doses.length} done
          </p>
        ) : null}
      </div>

      <div className="space-y-6">
        {grouped.map(({ period, items }) => (
          <div key={period}>
            <h3 className="mb-3 text-lg font-semibold text-garden-wood">{PERIOD_LABELS[period]}</h3>
            <ul className="space-y-3">
              {items.map((dose) => {
                const isTaken = Boolean(taken[dose.key])
                return (
                  <li key={dose.key}>
                    <button
                      type="button"
                      onClick={() => toggleDose(dose.key)}
                      className={`flex w-full items-center gap-4 rounded-garden border p-5 text-left transition-colors min-h-[72px] ${
                        isTaken
                          ? 'border-care-primary/40 bg-care-hover/80'
                          : 'border-garden-sage-200/65 bg-white hover:bg-garden-sage-50/50'
                      }`}
                      aria-pressed={isTaken}
                    >
                      {isTaken ? (
                        <CheckCircle2
                          className="h-8 w-8 shrink-0 text-care-primary"
                          aria-hidden
                        />
                      ) : (
                        <Circle className="h-8 w-8 shrink-0 text-garden-wood/45" aria-hidden />
                      )}
                      {dose.photoUrl ? (
                        <img
                          src={dose.photoUrl}
                          alt=""
                          className="h-14 w-14 shrink-0 border border-garden-clay-200/85 object-cover"
                        />
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="block text-xl font-semibold text-garden-wood">
                          {dose.name}
                        </span>
                        {dose.dosage ? (
                          <span className="block text-base text-garden-wood/80">{dose.dosage}</span>
                        ) : null}
                        <span className="block text-sm font-medium text-care-primary mt-1">
                          {dose.timeLabel}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-medium text-garden-wood/70">
                        {isTaken ? 'Taken' : 'Mark taken'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
