import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Check, Clock, Coins, MapPin, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROMO } from "@/content/promotions";
import { cn } from "@/lib/utils";

type PartnerTab = "refer" | "agent";

export default function PartnerEarnSection() {
  const [tab, setTab] = useState<PartnerTab>("refer");

  return (
    <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
      <div className="container">
        <div className="rounded-[2rem] overflow-hidden border border-slate-200/80 shadow-xl bg-gradient-to-br from-[#0A4B7F] via-[#0185B6] to-[#01B1A8] text-white">
          <div className="p-6 sm:p-10 lg:p-12">
            {/* Header + Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/15">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#FFF100]">
                  Earn with MaxiLotto
                </span>
                <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight">
                  Grow Your Income Beyond Winning Tickets
                </h2>
              </div>

              <div className="inline-flex rounded-full bg-black/20 p-1.5 border border-white/15 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => setTab("refer")}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    tab === "refer"
                      ? "bg-white text-[#0A4B7F] shadow-md"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  <Users className="w-4 h-4" />
                  Refer &amp; Earn ({PROMO.referralCommission})
                </button>
                <button
                  type="button"
                  onClick={() => setTab("agent")}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    tab === "agent"
                      ? "bg-[#FFF100] text-[#0A4B7F] shadow-md"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  <Briefcase className="w-4 h-4" />
                  Shop Agent POS
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {tab === "refer" ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                    Invite friends &amp; earn up to{" "}
                    <span className="text-[#FFF100]">{PROMO.referralCommission} commission</span>
                  </h3>
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl">
                    Share your personal referral link from your profile. Every time someone signs up with your link and plays, you earn ongoing commissions in your referral wallet.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[
                      "Share your link on WhatsApp or socials",
                      "Track your downline & daily earnings",
                      "Unlock Maxi Ambassador milestone perks",
                      "Withdraw or play directly with commissions",
                    ].map((point) => (
                      <li key={point} className="flex items-start gap-2 text-white/90">
                        <Check className="w-4 h-4 text-[#FFF100] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-white text-[#0A4B7F] hover:bg-slate-100 font-bold px-7 shadow-lg"
                    >
                      <Link to="/settings/referral">
                        Get Referral Link <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6"
                    >
                      <Link to="/referrals">View My Network</Link>
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                  {[
                    { value: PROMO.referralCommission, label: "Ambassador Rate" },
                    { value: "Lifetime", label: "Downline Tracking" },
                    { value: "Instant", label: "Wallet Credit" },
                    { value: "No Cap", label: "Max Referrals" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-5 text-center"
                    >
                      <p className="text-2xl sm:text-3xl font-black text-[#FFF100]">{stat.value}</p>
                      <p className="mt-1 text-xs font-semibold text-white/80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                    Turn your shop into a{" "}
                    <span className="text-[#FFF100]">MaxiLotto Retail Hub</span>
                  </h3>
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-xl">
                    Sell MaxiLotto 5/90 tickets on your PC or Web POS and earn attractive commissions on every ticket sold. Quick online onboarding takes under 5 minutes.
                  </p>
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-center gap-2.5 text-white/90">
                      <Coins className="w-4 h-4 text-[#FFF100] shrink-0" />
                      <span>Earn attractive commission on every ticket sold</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-white/90">
                      <MapPin className="w-4 h-4 text-[#FFF100] shrink-0" />
                      <span>Active in Delta State — expanding across Nigeria</span>
                    </li>
                    <li className="flex items-center gap-2.5 text-white/90">
                      <Clock className="w-4 h-4 text-[#FFF100] shrink-0" />
                      <span>Fast online application with 24/7 support</span>
                    </li>
                  </ul>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-[#FFF100] text-[#0A4B7F] hover:bg-[#ffe84a] font-extrabold px-8 shadow-lg"
                    >
                      <Link to="/become-an-agent">
                        Apply Now <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Link>
                    </Button>
                    <span className="text-xs text-white/75 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Terms &amp; conditions apply
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
                  {[
                    { value: "Free", label: "Agent Registration" },
                    { value: "5 min", label: "Online Application" },
                    { value: "Web POS", label: "PC & Mobile Ready" },
                    { value: "24/7", label: "Partner Support" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm p-5 text-center"
                    >
                      <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                      <p className="mt-1 text-xs font-semibold text-white/80">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

