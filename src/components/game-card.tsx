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
      className={cn(`bg-white/5 backdrop-blur-sm inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/10 p-4  shadow min-w-24 h-20 `, className)}>
      <div className="image-container">
        <Image src={finalImagePath(image || '')} alt={name} width={38} height={38}
          className="rounded object-fill" />
      </div>
      <div className="game-details flex flex-col">
        <h3 className="font-bold text-background">{name}</h3>
        {/* <p className="text-background  text-sm font-poppins">Description</p> */}
      </div>
    </div>
  )
}
export default GameCard