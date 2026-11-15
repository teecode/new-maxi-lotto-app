import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clock, Dices, Flame, Sparkles, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Countdown from "@/components/count-down";
import { useFetchDailyGames, useGetBetTypes } from "@/hooks/useGames";
import { isGameClosed, timeOnlyFormat } from "@/lib/game-time";
import { cn, formatCurrency } from "@/lib/utils";
import { useBetStore } from "@/store/bet-store";
import type { BetType, Game } from "@/types/game";

type QuickModeKey = "2-sure" | "1-direct" | "3-direct";

interface QuickModeOption {
  key: QuickModeKey;
  label: string;
  count: number;
  fallbackFactor: number;
  hint: string;
}

const QUICK_MODES: QuickModeOption[] = [
  { key: "2-sure", label: "2 Sure", count: 2, fallbackFactor: 240, hint: "Most popular · 240×" },
  { key: "1-direct", label: "1 Direct", count: 1, fallbackFactor: 40, hint: "Easy hit · 40×" },
  { key: "3-direct", label: "3 Direct", count: 3, fallbackFactor: 2100, hint: "Big payout · 2,100×" },
];

const QUICK_STAKES = [100, 200, 500, 1000];

function pickUniqueBalls(count: number): number[] {
  const pool = Array.from({ length: 90 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

function findMatchingBetType(betTypes: BetType[] | undefined, count: number): BetType | undefined {
  if (!betTypes?.length) return undefined;
  return (
    betTypes.find(
      (b) =>
        b.minimumNumberOfBalls === count &&
        b.maximumNumberOfBalls === count &&
        b.code.toUpperCase() !== "BANKER" &&
        b.nap !== "AG" &&
        b.nap !== "AGS",
    ) ??
    betTypes.find(
      (b) =>
        b.minimumNumberOfBalls === count &&
        b.code.toUpperCase() !== "BANKER" &&
        b.nap !== "AGS",
    )
  );
}

export default function QuickPlayWidget() {
  const navigate = useNavigate();
  const { selectedGame: currentSelectedGame, setSelectedGame, addBet, setBetsList } = useBetStore();
  const { data: games, isLoading: gamesLoading } = useFetchDailyGames();
  const { data: betTypes } = useGetBetTypes();

  const openGames = useMemo(() => {
    if (!games?.length) return [];
    return games
      .filter((g) => !isGameClosed(g.endDateTime))
      .sort((a, b) => new Date(a.endDateTime).getTime() - new Date(b.endDateTime).getTime());
  }, [games]);

  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [modeKey, setModeKey] = useState<QuickModeKey>("2-sure");
  const [balls, setBalls] = useState<number[]>(() => pickUniqueBalls(2));
  const [stake, setStake] = useState<number>(200);
  const [isRolling, setIsRolling] = useState(false);

  const activeGame: Game | undefined = useMemo(() => {
    if (!openGames.length) return undefined;
    return openGames.find((g) => g.gameID === selectedGameId) ?? openGames[0];
  }, [openGames, selectedGameId]);

  const activeMode = QUICK_MODES.find((m) => m.key === modeKey) ?? QUICK_MODES[0];
  const matchedBetType = useMemo(
    () => findMatchingBetType(betTypes, activeMode.count),
    [betTypes, activeMode.count],
  );

  useEffect(() => {
    setBalls(pickUniqueBalls(activeMode.count));
  }, [activeMode.count]);

  const winFactor = matchedBetType?.winFactor || activeMode.fallbackFactor;
  const potentialWin = stake * winFactor;

  const handleLuckyDip = () => {
    setIsRolling(true);
    setBalls(pickUniqueBalls(activeMode.count));
    window.setTimeout(() => setIsRolling(false), 260);
  };

  const handleRerollSingleBall = (index: number) => {
    const used = new Set(balls);
    const available: number[] = [];
    for (let n = 1; n <= 90; n++) {
      if (!used.has(n)) available.push(n);
    }
    if (!available.length) return;
    const replacement = available[Math.floor(Math.random() * available.length)];
    const next = [...balls];
    next[index] = replacement;
    setBalls(next.sort((a, b) => a - b));
  };

  const handlePlayTicket = async () => {
    if (activeGame) {
      const sameGame = currentSelectedGame?.gameID === activeGame.gameID;
      setSelectedGame(activeGame);
      if (
        matchedBetType &&
        stake >= matchedBetType.minimumStake &&
        stake <= matchedBetType.maximumStake
      ) {
        const quickBet = {
          betType: matchedBetType,
          selectedBalls: balls,
          bankerBalls: [],
          againstBalls: [],
          stake,
          amount: stake,
          maxWinning: stake * matchedBetType.winFactor,
          numberOfLines: 1,
          winningType: 1,
        };
        if (sameGame) {
          addBet(quickBet);
        } else {
          setBetsList([quickBet]);
        }
      } else if (!sameGame) {
        setBetsList([]);
      }
    }
    await navigate({ to: "/play" });
  };

  return (
    <div className="w-full rounded-3xl border border-white/15 bg-[#0c1a30]/85 p-5 sm:p-6 shadow-2xl shadow-black/40 backdrop-blur-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#01B1A8] to-[#0185B6] text-white shadow-md">
            <Ticket className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Quick Pick · 5/90
            </p>
            <h2 className="text-base font-bold text-white leading-tight">
              Instant Lucky Ticket
            </h2>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF100]/15 border border-[#FFF100]/30 px-2.5 py-1 text-[11px] font-bold text-[#FFF100]">
          <Flame className="w-3 h-3" />
          Tap ball to swap
        </span>
      </div>

      {/* Next Draw Selector */}
      <div className="mt-4">
        {gamesLoading ? (
          <Skeleton className="h-16 w-full rounded-2xl bg-white/10" />
        ) : activeGame ? (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Next Closing Draw
                </p>
                {openGames.length > 1 ? (
                  <select
                    aria-label="Choose upcoming draw"
                    value={activeGame.gameID}
                    onChange={(e) => setSelectedGameId(Number(e.target.value))}
                    className="mt-0.5 w-full bg-transparent text-sm sm:text-base font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {openGames.slice(0, 6).map((g) => (
                      <option key={g.gameID} value={g.gameID} className="bg-[#0f172a] text-white">
                        {g.gameName} ({timeOnlyFormat(g.endDateTime)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm sm:text-base font-bold text-white truncate">
                    {activeGame.gameName}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 text-[11px] text-cyan-300 font-semibold">
                  <Clock className="w-3 h-3" /> Closes in
                </span>
                <div className="text-sm sm:text-base font-mono font-bold text-[#FFF100]">
                  <Countdown targetDate={activeGame.endDateTime} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">All Today&apos;s Draws Closed</p>
              <p className="text-xs text-slate-300">View tomorrow&apos;s schedule or latest results.</p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate({ to: "/games" })}
              className="rounded-full text-xs font-bold shrink-0"
            >
              Schedule
            </Button>
          </div>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="mt-4">
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white/5 p-1 border border-white/10">
          {QUICK_MODES.map((m) => {
            const active = m.key === modeKey;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setModeKey(m.key)}
                className={cn(
                  "rounded-xl py-2 px-2 text-xs font-bold transition-all cursor-pointer",
                  active
                    ? "bg-gradient-to-r from-[#01B1A8] to-[#0185B6] text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )}
              >
                {m.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-slate-300 flex items-center justify-between px-1">
          <span>{activeMode.hint}</span>
          <span className="text-cyan-300 font-semibold">1–90 Pool</span>
        </p>
      </div>

      {/* Lucky Numbers */}
      <div className="mt-3.5 rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {balls.map((num, idx) => (
              <button
                key={`${idx}-${num}`}
                type="button"
                onClick={() => handleRerollSingleBall(idx)}
                title="Tap to swap this number"
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full text-base font-black text-[#0A4B7F] shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer tabular-nums",
                  "bg-gradient-to-br from-[#FFF880] via-[#FFF100] to-[#F59E0B]",
                  isRolling && "scale-90 opacity-75",
                )}
              >
                <span className="absolute top-1.5 left-2.5 h-2.5 w-3.5 rounded-full bg-white/60 blur-[1px]" />
                <span className="relative z-10">{String(num).padStart(2, "0")}</span>
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLuckyDip}
            className="rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 h-9 shrink-0 cursor-pointer"
          >
            <Dices className={cn("w-4 h-4 mr-1.5", isRolling && "animate-spin")} />
            Lucky Dip
          </Button>
        </div>
      </div>

      {/* Stake Picker */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-300 font-semibold">Select Stake</span>
          <span className="text-slate-400">
            Potential Win:{" "}
            <strong className="text-[#43f7c8] font-extrabold tabular-nums">
              {formatCurrency(potentialWin)}
            </strong>
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_STAKES.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setStake(amount)}
              className={cn(
                "rounded-xl py-2 text-xs font-bold border transition-all cursor-pointer tabular-nums",
                stake === amount
                  ? "bg-white text-[#0A4B7F] border-white shadow-md"
                  : "bg-white/5 text-white/85 border-white/15 hover:bg-white/10",
              )}
            >
              ₦{amount.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action */}
      <Button
        type="button"
        size="lg"
        onClick={handlePlayTicket}
        className="mt-5 w-full h-12 rounded-full bg-gradient-to-r from-[#ff005c] to-rose-500 hover:from-rose-500 hover:to-[#ff005c] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {activeGame ? "Play This Ticket" : "Go to Play Page"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
