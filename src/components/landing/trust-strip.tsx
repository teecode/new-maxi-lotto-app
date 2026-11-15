import { ShieldCheck, Smartphone, Trophy, Zap } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: Zap,
    title: "Instant Auto-Payouts",
    subtitle: "Winnings credit to your wallet automatically after draw validation",
    accent: "text-emerald-600 bg-emerald-500/10",
  },
  {
    icon: Smartphone,
    title: "Card, Bank & USSD",
    subtitle: "Fund fast with Paystack or Sarepay and withdraw to any Nigerian bank",
    accent: "text-[#0185B6] bg-[#0185B6]/10",
  },
  {
    icon: Trophy,
    title: "Official 5/90 Draws",
    subtitle: "Direct, Perm, Banker, Against, Machine & Double Chance bets",
    accent: "text-amber-600 bg-amber-500/10",
  },
  {
    icon: ShieldCheck,
    title: "18+ Safe & Transparent",
    subtitle: "Live video draws, verified results and responsible play tools",
    accent: "text-rose-600 bg-rose-500/10",
  },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Why players trust MaxiLotto"
      className="relative z-20 bg-white border-b border-slate-100"
    >
      <div className="container py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, title, subtitle, accent }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:bg-white hover:border-[#0185B6]/20 hover:shadow-sm"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
              >
                <Icon className="w-5 h-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-bold text-[#0A4B7F]">{title}</h3>
                <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

