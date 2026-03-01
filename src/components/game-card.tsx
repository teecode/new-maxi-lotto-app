import { cn, finalImagePath } from "@/lib/utils";
import { Image } from "@unpic/react";

interface GameCardProps {
  name: string;
  image?: string;
  description?: string;
  className?: string;
}

const GameCard = ({ name, className, image }: GameCardProps) => {

  return (
    <div
      className={cn("group bg-white/10 hover:bg-white/20 backdrop-blur-md inline-flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/20 shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300 min-w-40 h-20 cursor-pointer", className)}>
      <div className="relative shrink-0 image-container flex items-center justify-center bg-white/20 rounded-xl p-1 shadow-inner">
        <Image src={finalImagePath(image || '')} alt={name} width={42} height={42}
          className="rounded-lg object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="game-details flex flex-col justify-center">
        <h3 className="font-bold text-white text-base tracking-wide drop-shadow-sm">{name}</h3>
        {/* <p className="text-slate-200 text-xs font-medium">Play Now</p> */}
      </div>
    </div>
  )
}
export default GameCard