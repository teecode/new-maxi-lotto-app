import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useFetchDailyGames, useFetchLatestDraw, useFetchTopWinner } from '@/hooks/useGames'
import { Button } from '@/components/ui/button'
import { Marquee } from '@/components/ui/marquee'
import { Skeleton } from '@/components/ui/skeleton'
import GameCard from '@/components/game-card'
import GameCardSkeleton from '@/components/game-card-skeleton'
import LatestDrawTicket from '@/components/latest-draw-ticket'
import { formatCurrency, getLagosDateKey, maskUsernameIfPhoneNumber } from '@/lib/utils'
import { isGameClosed } from '@/lib/game-time'
import TodayGameSlider from '@/components/today-games-slider'
import type { EmblaOptionsType } from 'embla-carousel'
import { ArrowRight, CalendarClock, ChevronRight, Star, Trophy } from 'lucide-react'
import { Image } from '@unpic/react'
import { getRankColor } from '@/lib/ranks'
import HeroCarousel from '@/components/hero-carousel'
import BonusOffers from '@/components/bonus-offers'
import TrustStrip from '@/components/landing/trust-strip'
import HowToPlayPreview from '@/components/landing/how-to-play-preview'
import PartnerEarnSection from '@/components/landing/partner-earn-section'
import AppDownloadBanner from '@/components/landing/app-download-banner'
import { RichText } from '@/components/content/content-sections'
import { HOME_ABOUT_HEADING, HOME_ABOUT_POINTS, HOME_ABOUT_TEXT } from '@/content/home'

export const Route = createFileRoute('/_layout/')({
  component: App,
})

function App() {
  const { data: games, isLoading: gamesLoading } = useFetchDailyGames()
  const { data: latestDraws, isLoading: latestDrawsLoading } = useFetchLatestDraw()
  const { data: latestWinner, isLoading: winnersLoading } = useFetchTopWinner()

  const todaysGames = useMemo(() => {
    if (!games?.length) return []
    const todayLagos = getLagosDateKey()
    return games
      .filter((game) => {
        const gameDate = getLagosDateKey(game.endDateTime || game.date) || game.date.split('T')[0]
        return gameDate === todayLagos
      })
      .sort((a, b) => {
        const aClosed = isGameClosed(a.endDateTime)
        const bClosed = isGameClosed(b.endDateTime)
        if (aClosed !== bClosed) return aClosed ? 1 : -1
        return new Date(a.endDateTime).getTime() - new Date(b.endDateTime).getTime()
      })
  }, [games])

  const OPTIONS: EmblaOptionsType = { align: 'start' }

  return (
    <>
      {/* === Split Action Hero + Quick-Pick Widget === */}
      <HeroCarousel />

      {/* === Trust & Payout Proof Bar === */}
      <TrustStrip />

      {/* === Bonus offers from the back office (nothing shows until one is on the website) === */}
      <BonusOffers />

      {/* === Clickable Games Marquee === */}
      <section
        aria-label="Available 5/90 games"
        className="py-8 border-y border-white/10 relative shadow-[0_0_50px_rgba(0,0,0,0.35)] z-20 bg-gradient-to-r from-[#091527] via-[#0f2d37] to-[#091527]"
      >
        <div className="relative flex w-full flex-col overflow-x-hidden items-center justify-center">
          {gamesLoading ? (
            <div className="container flex gap-4 overflow-hidden py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          ) : games && games.length > 0 ? (
            <Marquee pauseOnHover repeat={4} className="[--duration:60s] !overflow-hidden py-1">
              {games.map((game) => (
                <GameCard
                  key={game.gameID}
                  game={game}
                  name={game.gameName}
                  image={game.gameImageUrl || undefined}
                />
              ))}
            </Marquee>
          ) : null}
        </div>
      </section>

      {/* === Today's Games === */}
      <section className="py-14 sm:py-20 relative overflow-hidden bg-white">
        <div className="container mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-8 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0185B6]">
                  Live Daily Schedule
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A4B7F] tracking-tight">
                Today&apos;s Games
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Pick an open draw below before closing time to place your ticket.
              </p>
            </div>
            <Link
              to="/games"
              className="inline-flex items-center gap-1.5 text-sm text-[#0185B6] font-bold hover:text-[#0A4B7F] hover:gap-2.5 transition-all duration-200 self-start sm:self-auto"
            >
              View full schedule <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {gamesLoading ? (
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-3xl bg-slate-100" />
              ))}
            </div>
          </div>
        ) : todaysGames.length > 0 ? (
          <TodayGameSlider options={OPTIONS} slides={todaysGames} />
        ) : (
          <div className="container">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center max-w-2xl mx-auto">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0185B6]/10 text-[#0185B6]">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A4B7F]">
                Today&apos;s draws have wrapped up
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Check upcoming draws on the schedule or browse the latest official draw numbers.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full bg-[#0185B6] hover:bg-[#0A4B7F] text-white font-bold px-6">
                  <Link to="/games">See Upcoming Games</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full font-bold px-6">
                  <Link to="/results">View Latest Results</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* === Latest Draw Results === */}
      <section className="py-14 sm:py-18 bg-[url('/winner-2.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-[#091527]/88 backdrop-blur-[2px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-[#43f7c8]" />
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Latest Draw Results
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Official winning numbers and machine numbers as soon as each draw closes.
                </p>
              </div>
            </div>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs sm:text-sm font-bold text-white backdrop-blur-sm transition-colors"
            >
              View All Results <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {latestDrawsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-56 w-full rounded-2xl bg-white/10" />
              ))}
            </div>
          ) : latestDraws && latestDraws.length > 0 ? (
            <LatestDrawTicket
              slides={latestDraws}
              options={{ slidesToScroll: 1, containScroll: 'trimSnaps', align: 'start' }}
            />
          ) : null}
        </div>
      </section>

      {/* === Recent Winners === */}
      <section className="py-14 sm:py-18 bg-white">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A4B7F] tracking-tight">
                Recent Winners
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Real players winning daily — paid straight to their MaxiLotto wallets.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/leaderboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <Trophy className="w-4 h-4 text-white fill-white" />
                <span>View Leaderboard</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {winnersLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl bg-slate-100" />
              ))
            ) : (
              latestWinner &&
              latestWinner.map((winner, index: number) => (
                <div
                  key={winner.ticketId ?? index}
                  className="group flex items-center gap-4 bg-slate-50/70 hover:bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#0185B6]/25 transition-all duration-300"
                >
                  <div className="flex size-12 shrink-0 justify-center items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/20">
                    <Image src="/winner-trophy.png" alt="Winner Trophy" width={28} height={28} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        @{maskUsernameIfPhoneNumber(winner.username || winner.name)}
                      </h4>
                      {winner.rank && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            color: getRankColor(winner.rank),
                            backgroundColor: `${getRankColor(winner.rank)}1A`,
                          }}
                        >
                          <Star
                            className="w-3 h-3"
                            style={{ fill: getRankColor(winner.rank), color: getRankColor(winner.rank) }}
                          />
                          {winner.rank}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {winner.game?.name || 'Lotto Game'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-base text-teal-600 tabular-nums">
                      {formatCurrency(winner.wonAmount)}
                    </p>
                    <p className="text-xs text-slate-400">Won</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* === How to Play in 3 Steps & Interactive Bet Types Preview === */}
      <HowToPlayPreview />

      {/* === Consolidated Partner & Earn (Refer & Earn + Shop Agent POS) === */}
      <PartnerEarnSection />

      {/* === Official Android App & PWA Download === */}
      <AppDownloadBanner />

      {/* === About / SEO copy === */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="container">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A4B7F]">{HOME_ABOUT_HEADING}</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
              <RichText text={HOME_ABOUT_TEXT} />
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOME_ABOUT_POINTS.map((point) => (
              <div key={point.title} className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                <h3 className="font-bold text-[#0A4B7F] mb-2">{point.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <RichText text={point.text} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
