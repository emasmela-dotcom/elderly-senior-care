import { describe, expect, it } from 'vitest'
import { parsePharmacyCsv } from './parsePharmacyCsv'

describe('parsePharmacyCsv', () => {
  it('parses drug name and dosage columns', () => {
    const csv = 'Drug Name,Dosage,Frequency\nLisinopril,10mg,Daily'
    const meds = parsePharmacyCsv(csv)
    expect(meds).toHaveLength(1)
    expect(meds[0]?.name).toBe('Lisinopril')
    expect(meds[0]?.dosage).toBe('10mg')
    expect(meds[0]?.frequency).toBe('Daily')
  })
})
