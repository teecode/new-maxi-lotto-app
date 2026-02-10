import { cn } from "@/lib/utils"

interface BallProps {
  value: number
  isSelected?: boolean
  onClick?: (value: number) => void
  className?: string
}

const Ball = ({ value, isSelected = false, onClick, className }: BallProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.(value)}
      className={cn(
        "relative flex justify-center items-center size-11 md:size-12 rounded-full font-bold text-sm md:text-base",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0185B6]",
        isSelected
          ? "active-ball shadow-inner"
          : "text-gray-700 hover:scale-105 shadow-md",
        className
      )}
    >
      {value}
      
      {/* Glossy shine effect for snooker ball look */}
      {isSelected && (
        <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full blur-sm"></div>
      )}
    </button>
  )
}

export default Ball
