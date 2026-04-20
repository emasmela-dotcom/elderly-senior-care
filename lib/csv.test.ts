import { describe, it, expect } from 'vitest'
import { rowsToCsv } from './csv'

describe('rowsToCsv', () => {
  it('joins headers and rows', () => {
    const csv = rowsToCsv(
      ['a', 'b'],
      [
        [1, 'x'],
        [2, 'y'],
      ]
    )
    expect(csv).toBe('a,b\n1,x\n2,y')
  })

  it('escapes commas', () => {
    const csv = rowsToCsv(['msg'], [['a, b']])
    expect(csv).toBe('msg\n"a, b"')
  })
})
