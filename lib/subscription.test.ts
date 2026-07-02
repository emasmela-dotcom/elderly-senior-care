import { describe, expect, it } from 'vitest'
import { buildPaymentPrompt } from './subscription'

describe('buildPaymentPrompt', () => {
  it('prompts in the last 3 trial days', () => {
    const trialEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    const result = buildPaymentPrompt('trialing', trialEnd, false)
    expect(result.needsPayment).toBe(true)
    expect(result.paymentPrompt).toContain('ends in 2 days')
  })

  it('hides prompt when card is already on file during trial', () => {
    const trialEnd = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    const result = buildPaymentPrompt('trialing', trialEnd, true)
    expect(result.needsPayment).toBe(false)
    expect(result.confirmationMessage).toContain('Card saved')
  })

  it('shows payment received when subscription is active', () => {
    const result = buildPaymentPrompt('active', null, true)
    expect(result.paymentReceived).toBe(true)
    expect(result.confirmationMessage).toContain('Payment received')
  })

  it('prompts when trial ended and subscription is paused', () => {
    const result = buildPaymentPrompt('paused', new Date(Date.now() - 1000).toISOString(), false)
    expect(result.needsPayment).toBe(true)
    expect(result.paymentPrompt).toContain('free trial has ended')
  })
})
