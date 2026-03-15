
import { Button } from "@/components/ui/button";
import type {UserInfoCardProps} from "@/types/profile";
import { formatCurrency } from "@/lib/utils";
import {Link} from "@tanstack/react-router";

import { getRankColor } from "@/lib/ranks";
// ... (keep existing imports)

const UserInfoCard = ({ name, balance, email, rank }: UserInfoCardProps) => {
  const rankColor = getRankColor(rank);

  return (
    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5">
      <div className="relative p-6 sm:p-10 flex flex-col items-center text-center gap-6">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/5 blur-[100px] rounded-full -z-10" />
        
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {name}
          </h2>
          <div className="flex flex-col items-center gap-3">
            <span 
              className="inline-flex items-center gap-1.5 text-xs font-black px-4 py-1.5 rounded-full border shadow-sm uppercase tracking-wider"
              style={{ 
                color: rankColor, 
                backgroundColor: `${rankColor}10`,
                borderColor: `${rankColor}30`
              }}
            >
              <span className="text-sm">★</span> {rank}
            </span>
            <p className="text-slate-500 text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              {email}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-7 py-8 border-y border-slate-50">
          <div className="flex flex-col items-center gap-1 text-slate-900">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Available Balance</span>
            <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter">
              {formatCurrency(balance)}
            </span>
          </div>

          <div className="grid grid-cols-2 w-full gap-4 max-w-sm">
            <Button
              asChild
              className="h-12 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/20 hover:bg-pink-600 hover:shadow-pink-500/30 transition-all duration-300"
            >
              <Link to="/deposit">Deposit</Link>
            </Button>
            <Button
              asChild
              className="h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold shadow-lg shadow-slate-950/20 transition-all duration-300"
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
