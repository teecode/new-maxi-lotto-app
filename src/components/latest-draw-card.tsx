import type { LatestDrawTicketResponse } from '@/types/api';
import { formattedDate } from '@/lib/utils';

interface LotteryTicketProps {
  item: LatestDrawTicketResponse
  className?: string
}

type Result = {
  [key: string]: number;
};

// Snooker-inspired ball colors
const ballColors = [
  "linear-gradient(145deg, #E53935 60%, #B71C1C 100%)",   // Red
  "linear-gradient(145deg, #1E88E5 60%, #0D47A1 100%)",   // Blue
  "linear-gradient(145deg, #43A047 60%, #1B5E20 100%)",   // Green
  "linear-gradient(145deg, #FFB300 60%, #E65100 100%)",   // Gold/Orange
  "linear-gradient(145deg, #8E24AA 60%, #4A148C 100%)",   // Purple
  "linear-gradient(145deg, #00897B 60%, #004D40 100%)",   // Teal
];

const LatestDrawCard = ({
  className, item
}: LotteryTicketProps) => {

  const result: Result = item.result;

  const winningBalls = Object.keys(result)
    .filter((key) => key.startsWith("winningBall"))
    .map((key) => result[key]);

  return (
    <div className={`relative rounded-2xl p-6 shadow-xl border border-white/10 overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #1A2A4A 50%, #0D1F3C 100%)"
      }}
    >
      {/* Subtle glow accent */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/8 rounded-full blur-2xl" />

      {/* Header section */}
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold tracking-tight shrink-0"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, #00D49C 38.46%, #006E51 100%)"
          }}
        >
          {item.gameCode}
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="font-bold text-base text-white truncate">{item.gameName}</h3>
          <span className="text-cyan-300/70 text-xs font-medium">
            {formattedDate(item.endDateTime)}
          </span>
        </div>
      </div>

      {/* Winning Numbers */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
          <h4 className="text-cyan-300/90 font-semibold text-sm uppercase tracking-wider">Winning Numbers</h4>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          {winningBalls.map((ball, idx) => (
            <div
              key={`winning-${idx}`}
              className="relative flex items-center justify-center size-10 rounded-full text-white font-bold text-sm shadow-lg"
              style={{
                background: ballColors[idx % ballColors.length],
              }}
            >
              {/* Glossy shine - snooker ball effect */}
              <div className="absolute top-1 left-1.5 w-3 h-3 bg-white/40 rounded-full blur-[2px]" />
              <span className="relative z-10">{ball}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestDrawCard;