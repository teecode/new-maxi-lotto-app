import type {Game} from "@/types/game.ts";
import {Button} from "@/components/ui/button.tsx";
import Countdown from "@/components/count-down.tsx";
import {Image} from "@unpic/react";
import {cn, finalImagePath, isGameClosed} from "@/lib/utils.ts";
import {useBetStore} from "@/store/bet-store.ts";
import {useNavigate} from "@tanstack/react-router";

interface TodayGameCardProps {
  game: Game
  className?: string
  isEven: boolean
}

const LatestDrawCard = ({ game, isEven
                        }: TodayGameCardProps) => {
  const {setSelectedGame} = useBetStore()
  const navigate = useNavigate()

  const playGame = async (game: Game) => {
    if (game) {
      setSelectedGame(game)
      await navigate({to: "/play"})
    }
  }

  return (
    <div  className={cn("relative grid grid-cols-1 overflow-hidden gap-4 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto", isEven ? "bg-gradient-to-br from-teal-500 to-teal-700 border border-teal-400/30" : "bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30")}>

      {/* Header section */}
      <div className="flex flex-col gap-4 items-center justify-start relative z-10">
        <div className="flex items-start space-x-2 w-full">
          <div className="flex flex-col gap-3 w-full items-center">
            <div className="image-container flex justify-center bg-white/20 p-2 rounded-2xl shadow-inner backdrop-blur-sm">
              <Image src={finalImagePath(game.gameBackgroundImageUrl)} alt={game.gameName} width={72} height={72}
                     className="rounded-xl object-contain drop-shadow-md" />
            </div>
            <h3 className={cn("font-bold text-xl truncate text-center tracking-tight", isEven ? "text-teal-50" : "text-white")}>
              {game.gameName}
            </h3>
            <div className="flex flex-col items-center w-full bg-black/10 rounded-xl py-3 px-4 backdrop-blur-sm">
              <span className="text-white/80 text-xs uppercase tracking-wider font-semibold mb-1">
                Next Draw in
              </span>
              <span className="block text-white font-mono text-lg tracking-widest font-bold">
                <Countdown targetDate={game.endDateTime} />
              </span>
            </div>
            <div className="flex justify-center w-full mt-2">
              <Button onClick={() => playGame(game)} type="button" size="lg" className={cn("w-full max-w-[200px] h-11 rounded-full font-bold shadow-lg transition-all duration-300", isEven ? "bg-[#FFE84A] text-teal-900 hover:bg-[#ffe01a]" : "bg-white text-blue-700 hover:bg-slate-50")} disabled={isGameClosed(game.endDateTime)}>
                {isGameClosed(game.endDateTime) ? 'Game Closed' : 'Play Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background overlay */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
};

export default LatestDrawCard;