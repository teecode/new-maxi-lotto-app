import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, CheckCircle2, Gamepad2, Layers, Trophy, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TWO_DIRECT_ODDS } from "@/content/two-sure";

const STEPS = [
  {
    step: "01",
    icon: Gamepad2,
    title: "Pick a Draw",
    description: "Choose any open 5/90 game on today's schedule before closing time.",
  },
  {
    step: "02",
    icon: Wallet,
    title: "Choose Numbers & Stake",
    description: "Select Direct, Perm, Banker, Against or Double Chance and set your stake.",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Win & Auto-Credit",
    description: "Once numbers are drawn and validated, wins land straight in your wallet.",
  },
];

interface BetPreview {
  id: string;
  label: string;
  badge: string;
  title: string;
  summary: string;
  exampleStake: string;
  examplePayout: string;
  href: string;
  cta: string;
}

const BET_PREVIEWS: BetPreview[] = [
  {
    id: "2-sure",
    label: "2 Sure (NAP 2)",
    badge: `${TWO_DIRECT_ODDS}× per line`,
    title: "Pick 2 numbers — both must drop",
    summary:
      "Nigeria's favourite 5/90 bet. Pick any 2 numbers from 1 to 90. If both appear among the 5 drawn winning numbers (in any order), you win 240× your stake.",
    exampleStake: "₦100 stake",
    examplePayout: "₦24,000 win",
    href: "/2-sure-lotto",
    cta: "Read 2 Sure guide",
  },
  {
    id: "perm-2",
    label: "Perm 2",
    badge: "Cover multiple pairs",
    title: "Turn a pool of numbers into winning pairs",
    summary:
      "Pick 3 to 10+ numbers and play every 2-number pair inside your pool. Even if only 2 of your numbers come out, you win; if 3 or 4 drop, multiple pairs pay at 240× each!",
    exampleStake: "4 balls · 6 lines (₦600)",
    examplePayout: "Up to ₦144,000+ if 4 drop",
    href: "/play",
    cta: "Play Perm 2",
  },
  {
    id: "banker",
    label: "Banker",
    badge: "1 ball vs 89",
    title: "Pair your strongest number against the rest",
    summary:
      "Confident in one lucky number? Banker pairs your 1 selected ball with all 89 remaining balls (89 lines). Every winning ball alongside yours earns a payout.",
    exampleStake: "₦10 × 89 lines (₦890)",
    examplePayout: "Pays on up to 4 winning pairs",
    href: "/how-to-play",
    cta: "See Banker odds",
  },
  {
    id: "double-chance",
    label: "Double Chance",
    badge: "Winning + Machine",
    title: "Win on either Winning or Machine numbers",
    summary:
      "Splits your bet evenly across the 5 Winning numbers and the 5 Machine numbers on supported draws, doubling your chances of hitting a winning line.",
    exampleStake: "1 bet · 2 draws covered",
    examplePayout: "Settles on both pools",
    href: "/play",
    cta: "Try Double Chance",
  },
  {
    id: "accumulator",
    label: "Special Combo",
    badge: "Multiplied odds",
    title: "Combine multiple picks into one boosted ticket",
    summary:
      "Build a multi-leg accumulator on a single draw where each leg's odds multiply together for massive returns on small stakes.",
    exampleStake: "Combine 2+ predictions",
    examplePayout: "Multiplied combo odds",
    href: "/accumulator",
    cta: "Play Special Combo",
  },
];

export default function HowToPlayPreview() {
  const [activeId, setActiveId] = useState<string>(BET_PREVIEWS[0].id);
  const current = BET_PREVIEWS.find((b) => b.id === activeId) ?? BET_PREVIEWS[0];

  return (
    <section className="py-16 sm:py-20 bg-[#f8fffe] border-y border-slate-100">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0185B6]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0185B6]">
              <Calculator className="w-3.5 h-3.5" /> New to Online 5/90?
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#0A4B7F] tracking-tight">
              Play in 3 Steps &amp; Know Your Payouts
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 max-w-2xl">
              Same classic Nigerian 5/90 shop bets — faster tickets, transparent multipliers, and instant wallet payouts.
            </p>
          </div>
          <Link
            to="/how-to-play"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0185B6] hover:text-[#0A4B7F] transition-colors shrink-0"
          >
            Full odds &amp; rules <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Steps Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {STEPS.map(({ step, icon: Icon, title, description }) => (
            <div
              key={step}
              className="relative rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="absolute top-5 right-5 text-3xl font-black text-slate-100 select-none">
                {step}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#01B1A8] to-[#0185B6] text-white shadow-md mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A4B7F]">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Interactive Bet Types Explorer */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0A1628] via-[#102647] to-[#0A1628] p-6 sm:p-8 text-white shadow-xl border border-white/10">
          <div className="flex flex-wrap gap-2 pb-6 border-b border-white/10">
            {BET_PREVIEWS.map((item) => {
              const active = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    active
                      ? "bg-[#FFF100] text-[#0A4B7F] shadow-md"
                      : "bg-white/10 text-white/80 hover:bg-white/15 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 px-3 py-1 text-xs font-bold text-cyan-300">
                <Layers className="w-3.5 h-3.5" /> {current.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {current.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {current.summary}
              </p>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Example Stake</span>
                <span className="font-bold text-white tabular-nums">{current.exampleStake}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-white/10 pt-3">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#43f7c8]" /> Potential Payout
                </span>
                <span className="font-extrabold text-[#43f7c8] text-base tabular-nums">
                  {current.examplePayout}
                </span>
              </div>
              <Button
                asChild
                className="w-full h-11 rounded-full bg-gradient-to-r from-[#01B1A8] to-[#0185B6] hover:opacity-95 text-white font-bold"
              >
                <Link to={current.href as any}>
                  {current.cta} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

