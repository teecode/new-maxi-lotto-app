import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@unpic/react";
import { cn, finalImagePath } from "@/lib/utils";
import { useBetStore } from "@/store/bet-store";
import type { Game } from "@/types/game";

interface GameCardProps {
  name: string;
  image?: string;
  description?: string;
  className?: string;
  game?: Game;
}

const GameCard = ({ name, className, image, game }: GameCardProps) => {
  const navigate = useNavigate();
  const { setSelectedGame } = useBetStore();

  const handleClick = async () => {
    if (game) {
      setSelectedGame(game);
    }
    await navigate({ to: "/play" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group bg-white/10 hover:bg-white/20 backdrop-blur-md inline-flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border border-white/15 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5 transition-all duration-300 min-w-44 h-20 cursor-pointer text-left",
        className,
      )}
    >
      <div className="relative shrink-0 image-container flex items-center justify-center bg-white/20 rounded-xl p-1 shadow-inner">
        <Image
          src={finalImagePath(image || "")}
          alt={name}
          width={42}
          height={42}
          className="rounded-lg object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="game-details flex flex-col justify-center min-w-0">
        <h3 className="font-bold text-white text-sm sm:text-base tracking-wide drop-shadow-sm truncate">
          {name}
        </h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300/90 group-hover:text-[#FFF100] transition-colors">
          Play Now <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </button>
  );
};

export default GameCard;
