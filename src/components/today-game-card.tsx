import type { Game } from "@/types/game.ts";
import { Button } from "@/components/ui/button.tsx";
import Countdown from "@/components/count-down.tsx";
import { Image } from "@unpic/react";
import { cn, finalImagePath } from "@/lib/utils.ts";
import { isGameClosed, timeOnlyFormat } from "@/lib/game-time";
import { useBetStore } from "@/store/bet-store.ts";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Flame } from "lucide-react";

interface TodayGameCardProps {
  game: Game;
  className?: string;
  isEven: boolean;
}

const TodayGameCard = ({ game, isEven, className }: TodayGameCardProps) => {
  const { setSelectedGame } = useBetStore();
  const navigate = useNavigate();

  const closed = isGameClosed(game.endDateTime);
  const msRemaining = new Date(game.endDateTime).getTime() - Date.now();
  const isClosingSoon = !closed && msRemaining > 0 && msRemaining <= 30 * 60 * 1000;

  const playGame = async (selected: Game) => {
    if (selected) {
      setSelectedGame(selected);
      await navigate({ to: "/play" });
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full h-full",
        closed
          ? "bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/40 opacity-85"
          : isEven
            ? "bg-gradient-to-br from-teal-500 to-teal-700 border border-teal-400/30"
            : "bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30",
        className,
      )}
    >
      {/* Top Status Badges */}
      <div className="flex items-center justify-between gap-2 relative z-10 mb-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-[11px] font-semibold text-white/90 backdrop-blur-sm">
          <Clock className="w-3 h-3" />
          {timeOnlyFormat(game.endDateTime)}
        </span>
        {isClosingSoon ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF100] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#0A4B7F] animate-pulse">
            <Flame className="w-3 h-3" /> Closing Soon
          </span>
        ) : closed ? (
          <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80">
            Closed
          </span>
        ) : (
          <span className="rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100">
            Open
          </span>
        )}
      </div>

      {/* Header section */}
      <div className="flex flex-col gap-3 items-center justify-start relative z-10">
        <div className="image-container flex justify-center bg-white/20 p-2 rounded-2xl shadow-inner backdrop-blur-sm">
          <Image
            src={finalImagePath(game.gameBackgroundImageUrl || game.gameImageUrl)}
            alt={game.gameName}
            width={68}
            height={68}
            className="rounded-xl object-contain drop-shadow-md"
          />
        </div>

        <h3
          className={cn(
            "font-extrabold text-lg sm:text-xl text-center tracking-tight line-clamp-1",
            isEven ? "text-teal-50" : "text-white",
          )}
        >
          {game.gameName}
        </h3>

        <div className="flex flex-col items-center w-full bg-black/15 rounded-2xl py-3 px-4 backdrop-blur-sm">
          <span className="text-white/80 text-[11px] uppercase tracking-wider font-semibold mb-0.5">
            {closed ? "Draw Status" : "Next Draw in"}
          </span>
          <span className="block text-white font-mono text-base sm:text-lg tracking-wider font-bold tabular-nums">
            <Countdown targetDate={game.endDateTime} />
          </span>
        </div>

        <Button
          onClick={() => playGame(game)}
          type="button"
          size="lg"
          className={cn(
            "w-full h-11 mt-1 rounded-full font-bold shadow-lg transition-all duration-300 cursor-pointer",
            closed
              ? "bg-white/20 text-white/80 hover:bg-white/20 cursor-not-allowed"
              : isEven
                ? "bg-[#FFE84A] text-teal-950 hover:bg-[#ffe01a]"
                : "bg-white text-blue-700 hover:bg-slate-50",
          )}
          disabled={closed}
        >
          {closed ? "Game Closed" : "Play Now"}
        </Button>
      </div>

      {/* Decorative background overlay */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default TodayGameCard;
