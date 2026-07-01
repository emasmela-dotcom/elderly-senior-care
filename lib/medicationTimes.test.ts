import { describe, expect, it } from 'vitest'
import { parseTimeToMinutes, periodForMinutes, formatTimeLabel } from './medicationTimes'

describe('medicationTimes', () => {
  it('parses 24h times', () => {
    expect(parseTimeToMinutes('08:00')).toBe(8 * 60)
    expect(parseTimeToMinutes('20:30')).toBe(20 * 60 + 30)
  })

  it('parses words', () => {
    expect(periodForMinutes(parseTimeToMinutes('morning')!)).toBe('morning')
    expect(periodForMinutes(parseTimeToMinutes('evening')!)).toBe('evening')
  })

  it('formats labels', () => {
    expect(formatTimeLabel('08:00')).toBe('8:00 AM')
    expect(formatTimeLabel('20:00')).toBe('8:00 PM')
  })
})
