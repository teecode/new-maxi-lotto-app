import { cn } from "@/lib/utils"

interface BallProps {
  value: number
  isSelected?: boolean
  onClick?: (value: number) => void
  className?: string
  variant?: 'default' | 'winning' | 'machine'
}

const Ball = ({ value, isSelected = false, onClick, className, variant = 'default' }: BallProps) => {
  const isGlossy = variant === 'winning' || variant === 'machine';
  
  return (
    <button
      type="button"
      onClick={() => onClick?.(value)}
      className={cn(
        "relative flex justify-center items-center size-11 md:size-12 rounded-full font-bold text-sm md:text-base",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0185B6]",
        !isGlossy && (isSelected
          ? "active-ball shadow-inner"
          : "text-gray-700 hover:scale-105 shadow-md"),
        variant === 'winning' && "bg-gradient-to-b from-[#01B1A8] to-[#0185B6] text-white shadow-lg",
        variant === 'machine' && "bg-gradient-to-b from-[#F9E23A] to-[#FDBF03] text-primary shadow-lg",
        className
      )}
    >
      {value}
      
      {/* Glossy shine effect for snooker ball look */}
      {(isSelected || isGlossy) && (
        <div className="absolute top-1 left-1 w-3 h-3 bg-white/40 rounded-full blur-[2px]"></div>
      )}
      
      {isGlossy && (
        <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(ellipse_at_30%_20%,_rgba(255,255,255,0.4)_0%,_transparent_50%)]" />
      )}
    </button>
  )
}

export default Ball
