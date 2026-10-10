import Ball from "@/components/ball.tsx"
import { cn } from "@/lib/utils"
import type { HitKind } from "@/lib/ticketHits"

const hitTitles: Record<HitKind, string | undefined> = {
  none: undefined,
  winning: 'Came up in the winning numbers',
  machine: 'Came up in the machine numbers',
  both: 'Came up in the winning and the machine numbers',
}

type TicketBallProps = {
  value: number
  hit: HitKind
  className?: string
  /** Styling for a number that did not come up (or whose draw is not in yet) */
  missClassName?: string
}

/** A number picked on a ticket. Once the draw is in, a number that came up is drawn as the result ball it matched. */
export function TicketBall({ value, hit, className, missClassName }: TicketBallProps) {
  return (
    <Ball
      value={value}
      variant={hit === 'none' ? 'default' : hit === 'machine' ? 'machine' : 'winning'}
      title={hitTitles[hit]}
      className={cn(
        className,
        hit === 'none' && missClassName,
        // In both draws: the winning ball, ringed in the machine colour
        hit === 'both' && "ring-2 ring-[#FDBF03] ring-offset-1"
      )}
    />
  )
}

type TicketHitLegendProps = {
  winning: boolean
  machine: boolean
}

/** Says what the two ball colours on a ticket's picked numbers mean */
export function TicketHitLegend({ winning, machine }: TicketHitLegendProps) {
  if (!winning && !machine) return null
  return (
    <div className="flex items-center gap-3 text-[10px] sm:text-xs font-medium text-gray-500" aria-label="Numbers that came up">
      {winning && (
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-gradient-to-b from-[#01B1A8] to-[#0185B6]" />Winning
        </span>
      )}
      {machine && (
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-gradient-to-b from-[#F9E23A] to-[#FDBF03]" />Machine
        </span>
      )}
    </div>
  )
}
