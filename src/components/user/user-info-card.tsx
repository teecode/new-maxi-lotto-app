
import { Button } from "@/components/ui/button";
import type {UserInfoCardProps} from "@/types/profile";
import { formatCurrency } from "@/lib/utils";
import {Link} from "@tanstack/react-router";

import { getRankColor } from "@/lib/ranks";
// ... (keep existing imports)

const UserInfoCard = ({ name, balance, email, rank }: UserInfoCardProps) => {
  const rankColor = getRankColor(rank);

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
      <div className="relative p-6 sm:p-10 flex flex-col items-center text-center gap-6">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/10 blur-[100px] rounded-full -z-10" />
        
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {name}
          </h2>
          <div className="flex flex-col items-center gap-2">
            <span 
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border border-current shadow-lg shadow-black/20"
              style={{ 
                color: rankColor, 
                backgroundColor: `${rankColor}15`,
              }}
            >
              <span className="text-sm">★</span> {rank}
            </span>
            <p className="text-slate-400 text-sm font-medium tracking-wide">
              {email}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6 py-6 border-y border-white/5">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Available Balance</span>
            <span className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tighter">
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="grid grid-cols-2 w-full gap-4 max-w-sm">
            <Button
              asChild
              className="h-12 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <Link to="/deposit">Deposit</Link>
            </Button>
            <Button
              asChild
              className="h-12 bg-white/10 text-white hover:bg-white/20 rounded-xl font-bold backdrop-blur-sm border border-white/10 transition-all duration-300"
            >
              <Link to="/withdrawal">Withdraw</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
