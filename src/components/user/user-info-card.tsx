import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getRankColor } from "@/lib/ranks";
import { formatCurrency, makeFirstLetterUppercase } from "@/lib/utils";
import type { UserInfoCardProps } from "@/types/profile";
import { RanksDisplay } from "./ranks-display";

const UserInfoCard = ({ name, balance, email, avatar, rank, isVerified }: UserInfoCardProps) => {
  const [isRanksOpen, setIsRanksOpen] = useState(false);
  const rankColor = getRankColor(rank);

  return (
    <div className="w-full animate-in fade-in zoom-in duration-500 overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5">
      <div className="relative p-6 sm:p-8 flex flex-col items-center text-center gap-5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/5 blur-[100px] rounded-full -z-10" />

        <Avatar className="size-20 ring-4 ring-[#0185B6]/15 shadow-md">
          <AvatarImage src={avatar} alt={name} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-[#01B1A8] to-[#0185B6] text-white text-2xl font-black">
            {makeFirstLetterUppercase(name)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2.5">
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {name}
            </h2>
            {isVerified && (
              <span title="Verified account">
                <BadgeCheck className="w-5 h-5 text-emerald-500" aria-label="Verified" />
              </span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRanksOpen(true)}
              className="group inline-flex items-center gap-1.5 text-xs font-black px-4 py-1.5 rounded-full border shadow-sm uppercase tracking-wider cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
              style={{
                color: rankColor,
                backgroundColor: `${rankColor}10`,
                borderColor: `${rankColor}30`,
              }}
            >
              <span className="text-sm group-hover:rotate-12 transition-transform duration-300">★</span>
              {rank}
            </button>
            <p className="text-slate-500 text-xs sm:text-sm font-medium tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              {email}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-5 py-6 border-t border-slate-100">
          <div className="flex flex-col items-center gap-1 text-slate-900">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              Available Balance
            </span>
            <span className="text-3xl sm:text-4xl font-black tabular-nums tracking-tighter text-[#0A4B7F]">
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="grid grid-cols-2 w-full gap-3 max-w-sm">
            <Button
              asChild
              className="h-11 bg-[#FF005C] text-white rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:bg-[#e60052] transition-all duration-300"
            >
              <Link to="/deposit">Deposit</Link>
            </Button>
            <Button
              asChild
              className="h-11 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold shadow-lg shadow-slate-950/20 transition-all duration-300"
            >
              <Link to="/withdrawal">Withdraw</Link>
            </Button>
          </div>
        </div>
      </div>

      <RanksDisplay
        isOpen={isRanksOpen}
        onClose={() => setIsRanksOpen(false)}
        currentRankName={rank}
      />
    </div>
  );
};

export default UserInfoCard;
