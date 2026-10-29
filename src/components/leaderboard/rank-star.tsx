import { Star } from 'lucide-react';
import { getRankColor } from '@/lib/ranks';
import { cn } from '@/lib/utils';

interface RankStarProps {
  rankName: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const RankStar = ({
  rankName,
  count = 5,
  size = 'md',
  showCount = false,
  className,
}: RankStarProps) => {
  const color = getRankColor(rankName);

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const starCount = Math.min(5, Math.max(1, count));

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: starCount }).map((_, index) => (
          <Star
            key={index}
            className={cn(starSizes[size], "transition-transform hover:scale-115 drop-shadow-sm")}
            style={{
              fill: color,
              color: color,
              filter: `drop-shadow(0 0 4px ${color}80)`,
            }}
          />
        ))}
      </div>
      {showCount && (
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded-md ml-1"
          style={{
            color: color,
            backgroundColor: `${color}1F`, // ~12% opacity
          }}
        >
          {starCount} ★
        </span>
      )}
    </div>
  );
};
