import type { GameResult } from "@/types/game"

const MACHINE = 2
const DOUBLE_CHANCE = 3

export type HitKind = 'none' | 'winning' | 'machine' | 'both'

/** One set of drawn balls, or none when the result holds a placeholder (0, -1 or 1-1-1-1-1) rather than a draw */
export function drawnBalls(result: GameResult | null | undefined, set: 'winning' | 'machine'): number[] {
  if (!result) return []
  const balls = ([1, 2, 3, 4, 5] as const).map((i) => Number(result[`${set}Ball${i}`]))
  const isDraw = balls.every((ball) => ball >= 1 && ball <= 90) && new Set(balls).size === 5
  return isDraw ? balls : []
}

/**
 * Which draw a picked number came up in. A number is only marked against the set(s) its bet is settled on:
 * Normal on the winning numbers, Machine on the machine numbers, Double Chance on both.
 */
export function hitKind(winningType: number, ball: number, winningBalls: number[], machineBalls: number[]): HitKind {
  const onWinning = winningType !== MACHINE && winningBalls.includes(ball)
  const onMachine = (winningType === MACHINE || winningType === DOUBLE_CHANCE) && machineBalls.includes(ball)
  if (onWinning && onMachine) return 'both'
  return onWinning ? 'winning' : onMachine ? 'machine' : 'none'
}
