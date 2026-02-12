import {createFileRoute, Link} from '@tanstack/react-router'
import {useFetchDailyGames, useFetchLatestDraw, useFetchTopWinner } from '@/hooks/useGames'
import {Button} from '@/components/ui/button'
import {Marquee} from '@/components/ui/marquee'
import GameCard from '@/components/game-card'
import {Spinner} from '@/components/ui/spinner'
import LatestDrawTicket from '@/components/latest-draw-ticket'
import {cn, formatCurrency} from '@/lib/utils'
import TodayGameSlider from "@/components/today-games-slider.tsx";
import type {EmblaOptionsType} from "embla-carousel";
import {ChevronRight, Gamepad2, UserPlus, Wallet, Trophy, Star} from "lucide-react";
import {Image} from "@unpic/react"
import { getRankColor } from "@/lib/ranks"

export const Route = createFileRoute('/_layout/')({
  component: App,
})

interface WhyChooseUsItem {
  id: number,
  title: string,
  description: string,
  icon: typeof Gamepad2,
  gradient: string,
}

const whyChooseUs: WhyChooseUsItem[] = [
  {
    id: 1,
    title: "How to Play",
    description: "Learn the rules and start winning in minutes",
    icon: Gamepad2,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: 2,
    title: "Join Us",
    description: "Create your account and join thousands of winners",
    icon: UserPlus,
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Fund Your Wallet",
    description: "Multiple secure payment options available instantly",
    icon: Wallet,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: 4,
    title: "Check Your Win",
    description: "View your results and claim your prizes anytime",
    icon: Trophy,
    gradient: "from-rose-500 to-pink-600",
  }
];

function App() {

  const {data: games} = useFetchDailyGames()

  const {data: latestDraws, isLoading: latestDrawsLoading} = useFetchLatestDraw()

  const {data: latestWinner} = useFetchTopWinner()

  const today = new Date().toISOString().split("T")[0];

  const todaysGames = games?.filter(game => {
    const gameDate = game.date.split("T")[0];
    return gameDate === today;
  });

  const OPTIONS: EmblaOptionsType = {align: 'start'}

  return (
    <>
      {/* === Hero Section === */}
      <section className="relative flex min-h-[420px] bg-[url('/new-bg.png')] bg-cover bg-center py-20 overflow-hidden">
        {/* Black overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

        <div className="container relative z-10">
          <div className="flex flex-col space-y-6 max-w-md">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Big Wins <span className="font-light">Start with</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">One Game</span>
            </h1>

            <p className="text-white/70 text-lg max-w-sm">
              Play your favorite lottery games and win big prizes every day.
            </p>

            <Button
              asChild
              className="bg-gradient-to-r from-rose-500 to-pink-600 w-fit px-10 hover:from-rose-600 hover:to-pink-700 text-base font-bold rounded-full sm:text-xl shadow-lg shadow-rose-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-105"
              size={"lg"}
            >
              <Link to="/play" className="text-background">
                Play Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/*=== Games Marquee === */}
      <section className="pb-8 relative bg-primary-900">
        <div className="relative flex w-full flex-col overflow-x-hidden items-center justify-center gap-1">
          {games && (
            <>
              <Marquee pauseOnHover repeat={3} className="[--duration:60s] !overflow-hidden">
                {games.map((review) => (
                  <GameCard key={review.gameID} name={review.gameName} image={review.gameImageUrl || undefined}/>
                ))}
              </Marquee>
            </>
          )}
        </div>
      </section>

      {/* === Latest Draw === */}
      <section className="py-12 sm:py-16 bg-[url('/latest-draw-bg.png')] bg-cover bg-center">
        <div className={cn("container mx-auto px-4")}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Draw</h2>
          </div>

          {latestDrawsLoading && (
            <Spinner/>
          )}

          {latestDraws && (
            <LatestDrawTicket slides={latestDraws}
                              options={{slidesToScroll: 1, containScroll: 'trimSnaps', align: 'start'}}/>
          )}

        </div>
      </section>


      {/*=== Today's Game ===*/}
      <section className="py-12 sm:py-16">
        <div className="container">
          <div className="space-y-2 mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-bgColor">Today's Games</h2>
            <p className="text-sm text-slate-500 leading-relaxed">You could be our next winner</p>
          </div>
        </div>
        {/* Today's game slider*/}
        {todaysGames && <TodayGameSlider options={OPTIONS} slides={todaysGames}/>}

        <div className="flex justify-center mt-8">
          <Link to="/games" className="text-sm flex items-center justify-center gap-2 text-primary-900 font-medium hover:gap-3 transition-all duration-300">
            View all games
            <ChevronRight className="text-primary-900 w-4 h-4"/>
          </Link>
        </div>

      </section>

      {/* === Why Choose Us === */}
      <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-br from-[#01B1A8] via-[#0195B6] to-[#0165A6]">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Why Choose MaxiLotto?</h2>
            <p className="text-white/70 text-base max-w-lg mx-auto">Start your winning journey in four simple steps</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map(({id, title, description, icon: Icon, gradient}) => (
              <div
                key={id}
                className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10"
              >
                {/* Step number */}
                <div className="absolute top-4 right-4 text-white/20 text-5xl font-black">
                  {id}
                </div>

                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br shadow-lg",
                  gradient
                )}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-lg text-white font-bold mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-5">{description}</p>

                <Button asChild size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full px-5 text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300">
                  <Link to="/play">Get Started</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Recent Winners === */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-bgColor">Recent Winners</h2>
              <p className="text-sm text-slate-500 mt-1">Our latest lucky players</p>
            </div>
            <Link to="/" className="text-sm text-primary-900 font-medium hover:underline flex items-center gap-1">
              See All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestWinner && latestWinner.map((winner, index: number) => (
              <div
                key={index}
                className="group flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-900/20 transition-all duration-300"
              >
                {/* Trophy icon */}
                <div className="flex size-12 shrink-0 justify-center items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-md shadow-rose-500/20">
                  <Image src="winner-trophy.png" alt="Winner Trophy" width={28} height={28} />
                </div>

                {/* Winner Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">
                      {winner.name || "Anonymous"}
                    </h4>
                    {/* Rank star */}
                    {winner.rank && (
                      <span 
                        className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ color: getRankColor(winner.rank), backgroundColor: `${getRankColor(winner.rank)}1A` }} // 1A = 10% opacity
                      >
                        <Star className="w-3 h-3" style={{ fill: getRankColor(winner.rank), color: getRankColor(winner.rank) }} />
                        {winner.rank}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {winner.game?.name || "Lotto Game"}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-base text-teal-600">
                    {formatCurrency(winner.wonAmount)}
                  </p>
                  <p className="text-xs text-slate-400">Won</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </section>

    </>
  )
}
