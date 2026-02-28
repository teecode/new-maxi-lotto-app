import {createFileRoute, useNavigate} from '@tanstack/react-router'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Image } from '@unpic/react'
import { useFetchDailyGames } from '@/hooks/useGames'
import * as _ from 'lodash';

import { Spinner } from '@/components/ui/spinner'
import {cn, finalImagePath, formattedDate, isGameClosed} from '@/lib/utils'
import type {Game} from "@/types/game.ts";
import Countdown from "@/components/count-down.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useBetStore} from "@/store/bet-store.ts";
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/games')({
  component: RouteComponent
})

function RouteComponent() {

  const { data: games, isLoading } = useFetchDailyGames()
  const {setSelectedGame} = useBetStore()
  const navigate = useNavigate()

  const groupGamesByDate = _.groupBy(games, 'date');

  const playGame = async (game: Game) => {
    if (game) {
      setSelectedGame(game)
      await navigate({to: "/play"})
    }
  }

  return (
    <>
      <PageHeader title="Games"/>

      <section className="overflow-hidden py-8 sm:py-16">
        <div className="container">
        {isLoading && (
          <Spinner />
        )}
        {groupGamesByDate && Object.keys(groupGamesByDate).map((game, index) => (
          <Accordion
            key={index}
            type="single"
            collapsible
            className="w-full"
            defaultValue={`item-${index}`}
          >
            <AccordionItem value={`item-${index}`} className="space-y-2 border-b-0">
              <AccordionTrigger className="flex items-center gap-5 bg-primary-900 rounded-2xl px-4">
                <div className="flex items-center gap-4">
                  {/* Content */}
                  <div className="flex-1 min-w-0 py-2">
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {formattedDate(game)}
                    </h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                {groupGamesByDate[game].map((game: Game, index: number) => (
                  <div key={index} className="rounded-lg w-full shadow-xs border border-gray-200 overflow-hidden max-w-sm mx-auto">
                    <button onClick={() => playGame(game)} type="button" className={cn("flex items-stretch w-full gap-0 cursor-pointer", isGameClosed(game.endDateTime) ? "opacity-50 cursor-not-allowed" : "")} disabled={isGameClosed(game.endDateTime)}>
                      {/* Icon container - Full height with gray background */}
                      <div className="bg-gray-200 flex items-center justify-center px-4">
                        <div className="size-12 rounded-full flex items-center justify-center shadow-lg">
                          <Image
                            src={finalImagePath(game.gameBackgroundImageUrl)}
                            alt={game.gameName}
                            width={38}
                            height={38}
                            priority
                            className="rounded size-12"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 w-full py-2 px-4 text-left">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {game.gameName}
                        </h3>
                        <Badge variant="secondary" className="bg-gray-100 text-amber-500 font-medium px-5">
                          {game.gameID}
                        </Badge>
                        <p className="text-sm text-foreground-muted">
                          <Countdown targetDate={game.endDateTime} />
                        </p>
                        {/* Stats row */}
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-orange-500 font-medium">{formattedDate(game.endDateTime)}</span>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
        </div>
      </section>
    </>
  )
}
