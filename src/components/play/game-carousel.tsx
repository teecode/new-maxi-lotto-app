import { NextButton, PrevButton, usePrevNextButtons } from '@/components/embla-carousel-arrow-button'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Add this import
import { cn, finalImagePath, fullDateTimeFormat, isGameClosed } from "@/lib/utils";
import type { Game } from '@/types/game'
import type { EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { Image } from '@unpic/react';
import {useBetStore} from "@/store/bet-store.ts";

type PropType = {
  games: Game[]
  options?: EmblaOptionsType,
  className?: string,
  handleSelectedGame: (game: Game) => void
}

const GameCarousel: React.FC<PropType> = (props) => {

  const { games, options, handleSelectedGame } = props
  const {selectedGame} = useBetStore()

  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: true,
    dragFree: true,
    ...options
  }, [
    AutoScroll({ playOnInit: false }), Autoplay({ playOnInit: true, delay: 4000 })
  ])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const onButtonAutoplayClick = useCallback(
    (callback: () => void) => {
      const autoScroll = emblaApi?.plugins()?.autoScroll
      if (!autoScroll) {
        return
      }

      const resetOrStop =
        autoScroll.options.stopOnInteraction === false
          ? autoScroll.reset
          : autoScroll.stop

      resetOrStop()
      callback()
    },
    [emblaApi]
  )

  // Helper function to get game timing badge
  const getGameTimingBadge = (endDateTime: string) => {
    const now = new Date()
    const gameEnd = new Date(endDateTime)

    // Reset time to midnight for date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const gameDate = new Date(gameEnd.getFullYear(), gameEnd.getMonth(), gameEnd.getDate())

    // Calculate difference in days
    const diffTime = gameDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return { label: 'Today', variant: 'outline' as const, className: 'bg-teal-500/50 text-teal-800 hover:bg-teal-600' }
    } else if (diffDays === 1) {
      return { label: 'Tomorrow', variant: 'outline' as const, className: 'bg-blue-500/50 hover:bg-blue-600 text-white' }
    } else if (diffDays === 2) {
      return { label: 'Later', variant: 'outline' as const, className: 'bg-orange-500/50 hover:bg-orange-600 text-white border-orange-500' }
    }

    return null
  }
  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {games.map((game) => {
            const timingBadge = getGameTimingBadge(game.endDateTime)
            const isClosed = isGameClosed(game.endDateTime)
            const isActive = selectedGame?.gameID === game.gameID

            return (
              <div className="embla__slide" style={{ "--slide-size": "100%" } as React.CSSProperties} key={game.gameID}>
                <div
                  onClick={() => !isClosed && handleSelectedGame(game)}
                  className={cn(
                    "relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300",
                    isActive 
                      ? "bg-gradient-to-br from-[#FFF100] to-[#FFD700] border-4 border-[#0185B6] shadow-2xl shadow-[#0185B6]/50 scale-[1.05]" 
                      : isClosed
                        ? "bg-gray-100 border-2 border-gray-300 opacity-60 grayscale"
                        : "bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-[#0185B6] hover:shadow-2xl cursor-pointer"
                  )}
                >
                  {/* Decorative top bar */}
                  <div className={cn(
                    "h-2 w-full",
                    isActive 
                      ? "bg-gradient-to-r from-[#0185B6] to-[#01B1A8]" 
                      : isClosed
                        ? "bg-gray-400"
                        : "bg-gradient-to-r from-[#0185B6]/50 to-[#01B1A8]/50"
                  )} />

                  <div className="p-3">
                    {/* Stack layout for better space utilization */}
                    <div className="flex flex-col gap-3">
                      {/* Top: Image + Game Name + Badge */}
                      <div className="flex items-center gap-3">
                        {/* Game Image with gradient border */}
                        <div className={cn(
                          "relative rounded-xl p-1 bg-gradient-to-br shadow-lg flex-shrink-0",
                          isActive 
                            ? "from-[#0185B6] to-[#01B1A8] shadow-[#0185B6]/50" 
                            : isClosed
                              ? "from-gray-400 to-gray-500"
                              : "from-[#0185B6]/70 to-[#01B1A8]/70"
                        )}>
                          <div className="bg-white rounded-lg p-1">
                            <Image
                              src={finalImagePath(game.gameBackgroundImageUrl)}
                              alt={game.gameName}
                              width={44}
                              height={44}
                              className="rounded-lg object-cover"
                            />
                          </div>
                        </div>

                        {/* Game Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className={cn(
                              "font-bold text-sm truncate",
                              isActive ? "text-[#0185B6]" : "text-[#0A4B7F]"
                            )}>
                              {game.gameName}
                            </h3>
                            {timingBadge && (
                              <Badge
                                variant={timingBadge.variant}
                                className={cn(
                                  "text-xs font-bold px-2 py-0.5 flex-shrink-0",
                                  timingBadge.className
                                )}
                              >
                                {timingBadge.label}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <span className="opacity-70">🕒</span>
                            <p className="truncate font-medium">
                              {fullDateTimeFormat(game.endDateTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom: Action Button - Full Width */}
                      <Button
                        type="button"
                        size="md"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectedGame(game)
                        }}
                        className={cn(
                          "w-full px-6 h-9 rounded-xl font-bold text-sm shadow-md transition-all",
                          isClosed
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : isActive
                              ? "bg-gradient-to-r from-[#FFF100] to-[#FFD700] text-[#0A4B7F] hover:shadow-lg hover:scale-105"
                              : "bg-gradient-to-r from-[#0185B6] to-[#01B1A8] text-white hover:shadow-lg hover:scale-105"
                        )}
                        disabled={isClosed}
                      >
                        {isClosed ? '🔒 Closed' : isActive ? '✅ Playing' : '🎮 Play Now'}
                      </Button>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-3 right-3">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFF100] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFF100]"></span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>
      </div>
    </div>
  )
}

export default GameCarousel