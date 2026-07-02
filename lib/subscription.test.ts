import { describe, expect, it } from 'vitest'
import { buildPaymentPrompt } from './subscription'

describe('buildPaymentPrompt', () => {
  it('prompts in the last 3 trial days', () => {
    const trialEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    const result = buildPaymentPrompt('trialing', trialEnd)
    expect(result.needsPayment).toBe(true)
    expect(result.paymentPrompt).toContain('ends in 2 days')
  })

  it('prompts when trial ended and subscription is paused', () => {
    const result = buildPaymentPrompt('paused', new Date(Date.now() - 1000).toISOString())
    expect(result.needsPayment).toBe(true)
    expect(result.paymentPrompt).toContain('free trial has ended')
  })
})
