import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { TWO_DIRECT_ODDS } from "@/content/two-sure";

const pairs = (n: number) => (n * (n - 1)) / 2;
const naira = (n: number) => `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

/** Perm 2: how many lines a pool makes, what it costs, and what it pays as more of the numbers drop. */
export function PermCalculator() {
  const [count, setCount] = useState(5);
  const [stake, setStake] = useState(100);
  const lines = pairs(count);
  const safeStake = Number.isFinite(stake) && stake > 0 ? stake : 0;
  // At most five of your numbers can be among the five winning numbers.
  const outcomes = Array.from({ length: Math.min(count, 5) - 1 }, (_, i) => i + 2);

  return (
    <div className="rounded-3xl bg-white border-2 border-[#01B1A8]/30 shadow-sm p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-[#01B1A8]/10 text-[#0185B6]">
          <Calculator className="size-5" />
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0A4B7F]">Perm 2 calculator</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">
          <span>Numbers in your perm</span>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base font-medium"
          >
            {Array.from({ length: 14 }, (_, i) => i + 2).map((n) => (
              <option key={n} value={n}>
                {n} numbers
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 text-sm font-semibold text-slate-700">
          <span>Stake per line (₦)</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={Number.isFinite(stake) ? stake : ""}
            onChange={(e) => setStake(e.target.valueAsNumber)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base font-medium"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lines</p>
          <p className="text-2xl font-bold text-[#0A4B7F]">{lines}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total stake</p>
          <p className="text-2xl font-bold text-[#0A4B7F]">{naira(lines * safeStake)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0A4B7F] text-white">
            <tr>
              <th scope="col" className="p-3">If this many of your numbers drop</th>
              <th scope="col" className="p-3">Winning pairs</th>
              <th scope="col" className="p-3">You win</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {outcomes.map((k) => (
              <tr key={k} className="even:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-800">{k}</td>
                <td className="p-3 text-slate-600">{pairs(k)}</td>
                <td className="p-3 font-bold text-emerald-700">{naira(pairs(k) * safeStake * TWO_DIRECT_ODDS)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        At {TWO_DIRECT_ODDS}x per winning pair, as published on <Link to="/how-to-play" className="underline">How to Play</Link>. Your bet slip
        shows the exact lines, stake and possible winning before you confirm.
      </p>
    </div>
  );
}
