import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Image } from '@unpic/react'
import { useFetchDailyGames } from '@/hooks/useGames'
import * as _ from 'lodash';
import moment from 'moment';

import { Spinner } from '@/components/ui/spinner'
import { cn, finalImagePath, isGameClosed } from '@/lib/utils'
import type { Game } from "@/types/game.ts";
import Countdown from "@/components/count-down.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useBetStore } from "@/store/bet-store.ts";
import PageHeader from "@/components/layouts/page-header.tsx";
import { Button } from '@/components/ui/button';
import { Share2, Clock, PlayCircle, ChevronRight } from 'lucide-react';
import { GameScheduleModal } from '@/components/games/GameScheduleModal';

export const Route = createFileRoute('/_layout/games')({
  component: RouteComponent
})

function RouteComponent() {
  const { data: games, isLoading } = useFetchDailyGames()
  const { setSelectedGame } = useBetStore()
  const navigate = useNavigate()
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

  const groupGamesByDate = _.groupBy(games, 'date');
  const todayGames = games || [];

  const playGame = async (game: Game) => {
    if (game && !isGameClosed(game.endDateTime)) {
      setSelectedGame(game)
      await navigate({ to: "/play" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader title="Daily Games" />

      <section className="py-8 sm:py-16">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0A4B7F] tracking-tight">Available Draws</h2>
              <p className="text-gray-500 text-sm sm:text-base font-medium">Select a game to participate in today's draws</p>
            </div>
            <Button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="w-full sm:w-auto bg-[#0A4B7F] hover:bg-[#0A4B7F]/90 text-white font-bold h-11 px-6 rounded-full shadow-lg shadow-[#0A4B7F]/20 gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Share2 className="size-4" />
              Share Today's Schedule
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-12">
              {Object.keys(groupGamesByDate).map((date) => (
                <div key={date} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-200" />
                    <Badge variant="outline" className="px-6 py-1.5 rounded-full border-gray-300 bg-white text-gray-600 font-bold uppercase tracking-wider text-[10px] sm:text-xs shadow-sm">
                      {moment(date).format('dddd, Do MMMM YYYY')}
                    </Badge>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupGamesByDate[date].map((game: Game) => {
                      const closed = isGameClosed(game.endDateTime);
                      return (
                        <div 
                          key={game.gameID} 
                          className={cn(
                            "group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500",
                            closed && "opacity-75 grayscale-[0.5]"
                          )}
                        >
                          {/* Banner/Image Area */}
                          <div className="relative h-40 sm:h-48 overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                             <Image
                                src={finalImagePath(game.gameBackgroundImageUrl)}
                                alt={game.gameName}
                                layout="fullWidth"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              
                              {/* Overlay Content */}
                              <div className="absolute top-4 left-4 z-20">
                                <Badge className="bg-[#FFF100] text-[#0A4B7F] border-0 font-black px-3 py-1 text-xs">
                                  ID: {game.gameID}
                                </Badge>
                              </div>

                              <div className="absolute top-4 right-4 z-20">
                                <div className="size-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                  <span className="text-white font-black text-[10px]">18+</span>
                                </div>
                              </div>

                              <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end text-white">
                                <div className="space-y-0.5">
                                  <h3 className="text-xl font-bold tracking-tight">{game.gameName}</h3>
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 uppercase tracking-widest leading-none">
                                    <Clock className="size-3" />
                                    Closes: {moment(game.endDateTime).format('h:mm A')}
                                  </div>
                                </div>
                              </div>
                          </div>

                          {/* Details Area */}
                          <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status</p>
                                <div className="flex items-center gap-2">
                                  <div className={cn("size-2 rounded-full", closed ? "bg-red-500" : "bg-green-500 animate-pulse")} />
                                  <span className={cn("text-xs font-bold uppercase", closed ? "text-red-500" : "text-green-600")}>
                                    {closed ? "Draw Closed" : "Accepting Bets"}
                                  </span>
                                </div>
                              </div>

                              {!closed && (
                                <div className="text-right">
                                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Time Left</p>
                                  <div className="text-[#0A4B7F] font-black text-sm font-mono">
                                    <Countdown targetDate={game.endDateTime} />
                                  </div>
                                </div>
                              )}
                            </div>

                            <Button 
                              onClick={() => playGame(game)}
                              disabled={closed}
                              className={cn(
                                "w-full h-12 rounded-2xl font-black uppercase tracking-wider text-sm gap-2 transition-all",
                                closed 
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                                  : "bg-gradient-to-r from-[#0A4B7F] to-[#0185B6] text-white shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 active:scale-[0.98]"
                              )}
                            >
                              {closed ? (
                                <>
                                  <Clock className="size-4" />
                                  Expired
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="size-4" />
                                  Play Now
                                  <ChevronRight className="size-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <GameScheduleModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        games={todayGames}
      />
    </div>
  )
}
