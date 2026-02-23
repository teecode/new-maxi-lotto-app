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
    <div  className={cn("relative grid grid-cols-1 overflow-hidden gap-4 rounded-[20px] p-6 shadow-2xl max-w-md mx-auto", isEven ? "bg-teal-900/40 border border-teal-500/20 " : "bg-cyan-900/40 border border-cyan-500/20")}>

      {/* Header section */}
      <div className="flex flex-col gap-4 items-center justify-start">
        <div className="flex items-start space-x-2">
          <div className="flex flex-col gap-2">
            <div className="image-container flex justify-center">
              <Image src={finalImagePath(game.gameBackgroundImageUrl)} alt={game.gameName} width={67} height={67}
                     className="rounded object-fill" />
            </div>
            <h3 className={cn("font-bold text-lg truncate text-center", isEven ? "text-[#FFE84A]" : "text-bgColor")}>
              {game.gameName}
            </h3>
            <div className="flex flex-col">
              <div className="text-foreground text-sm text-center truncate">
                Next Draw in: <span className="block"><Countdown targetDate={game.endDateTime} /></span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => playGame(game)} type="button" size="md" className={cn("w-fit  px-4 h-9 text-background rounded-full hover:opacity-80", isEven ? "bg-[#FFE84A] text-bgColor " : "bg-primary-900 text-white")} disabled={isGameClosed(game.endDateTime)}>
                {isGameClosed(game.endDateTime) ? 'Game Closed' : 'Play Now'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestDrawCard;