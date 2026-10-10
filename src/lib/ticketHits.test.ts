import { describe, expect, it } from 'vitest'
import { drawnBalls, hitKind } from './ticketHits'
import type { GameResult } from '@/types/game'

const NORMAL = 1
const MACHINE = 2
const DOUBLE_CHANCE = 3

const result = (machine: number[] = [4, 27, 72, 29, 54]): GameResult => ({
  winningBall1: 6, winningBall2: 51, winningBall3: 30, winningBall4: 85, winningBall5: 10,
  machineBall1: machine[0], machineBall2: machine[1], machineBall3: machine[2], machineBall4: machine[3], machineBall5: machine[4],
})

const winning = [6, 51, 30, 85, 10]
const machine = [4, 27, 72, 29, 54]

describe('drawnBalls', () => {
  it('reads each set of five from the result', () => {
    expect(drawnBalls(result(), 'winning')).toEqual(winning)
    expect(drawnBalls(result(), 'machine')).toEqual(machine)
  })

  it('gives nothing while there is no result', () => {
    expect(drawnBalls(undefined, 'winning')).toEqual([])
    expect(drawnBalls(null, 'machine')).toEqual([])
  })

  it.each([
    ['1-1-1-1-1', [1, 1, 1, 1, 1]],
    ['zeros', [0, 0, 0, 0, 0]],
    ['-1', [-1, -1, -1, -1, -1]],
  ])('treats placeholder machine numbers (%s) as no draw', (_, placeholder) => {
    expect(drawnBalls(result(placeholder), 'machine')).toEqual([])
    expect(drawnBalls(result(placeholder), 'winning')).toEqual(winning)
  })
})

describe('hitKind', () => {
  it('marks a Normal bet on the winning numbers only', () => {
    expect(hitKind(NORMAL, 30, winning, machine)).toBe('winning')
    expect(hitKind(NORMAL, 27, winning, machine)).toBe('none')
    expect(hitKind(NORMAL, 88, winning, machine)).toBe('none')
  })

  it('marks a Machine bet on the machine numbers only', () => {
    expect(hitKind(MACHINE, 27, winning, machine)).toBe('machine')
    expect(hitKind(MACHINE, 30, winning, machine)).toBe('none')
  })

  it('marks a Double Chance bet on either set', () => {
    expect(hitKind(DOUBLE_CHANCE, 30, winning, machine)).toBe('winning')
    expect(hitKind(DOUBLE_CHANCE, 27, winning, machine)).toBe('machine')
    expect(hitKind(DOUBLE_CHANCE, 88, winning, machine)).toBe('none')
  })

  it('says so when a number came up in both draws', () => {
    const machineSharing30 = [30, 27, 72, 29, 54]
    expect(hitKind(DOUBLE_CHANCE, 30, winning, machineSharing30)).toBe('both')
    // the other bet types still only look at their own set
    expect(hitKind(NORMAL, 30, winning, machineSharing30)).toBe('winning')
    expect(hitKind(MACHINE, 30, winning, machineSharing30)).toBe('machine')
  })

  it('marks nothing before the draw, and never the 0 placeholder of a market bet', () => {
    expect(hitKind(NORMAL, 30, [], [])).toBe('none')
    expect(hitKind(DOUBLE_CHANCE, 0, winning, machine)).toBe('none')
  })

  it('does not mark a Double Chance or Machine bet on machine numbers that are a placeholder', () => {
    const noMachineDraw = drawnBalls(result([1, 1, 1, 1, 1]), 'machine')
    expect(hitKind(MACHINE, 1, winning, noMachineDraw)).toBe('none')
    expect(hitKind(DOUBLE_CHANCE, 1, winning, noMachineDraw)).toBe('none')
    expect(hitKind(DOUBLE_CHANCE, 6, winning, noMachineDraw)).toBe('winning')
  })
})
