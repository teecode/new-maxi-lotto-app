import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Wallet, Zap } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { PROMO } from "@/content/promotions";
import useAuthStore from "@/store/authStore";
import QuickPlayWidget from "@/components/landing/quick-play-widget";

interface SlideData {
  id: number;
  eyebrow: string;
  headline: React.ReactNode;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  secondaryText: string;
  secondaryLink: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    eyebrow: "Nigeria's Premier 5/90 Online Lotto",
    headline: (
      <>
        Big Wins Start with{" "}
        <span className="bg-gradient-to-r from-[#43f7c8] via-cyan-300 to-[#FFF100] bg-clip-text text-transparent">
          One Game
        </span>
      </>
    ),
    description:
      "Play Direct (2 Sure), Perm, Banker and Double Chance on official daily draws — with instant automated payouts straight to your bank.",
    image: "/new-bg.jpg",
    ctaText: "Play 5/90 Now",
    ctaLink: "/play",
    secondaryText: "View Results",
    secondaryLink: "/results",
  },
  {
    id: 2,
    eyebrow: "Welcome Deposit Offer",
    headline: (
      <>
        Double Your Luck:{" "}
        <span className="bg-gradient-to-r from-[#FFF100] to-amber-300 bg-clip-text text-transparent">
          {PROMO.firstDepositBonus} First Bonus
        </span>
      </>
    ),
    description: `Get a ${PROMO.firstDepositBonus} bonus on your first deposit and ${PROMO.laterDepositBonus} on subsequent deposits while the offer runs.`,
    image: "/slide-2.png",
    ctaText: "Claim Bonus",
    ctaLink: "/promotions",
    secondaryText: "Deposit Now",
    secondaryLink: "/deposit",
  },
  {
    id: 3,
    eyebrow: "Lightning Auto-Payouts",
    headline: (
      <>
        Win Today,{" "}
        <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">
          Spend Today
        </span>
      </>
    ),
    description:
      "No waiting in queues or chasing paper slips. Winning tickets settle straight into your wallet seconds after draw validation.",
    image: "/slide-4.png",
    ctaText: "Play Today's Draws",
    ctaLink: "/games",
    secondaryText: "How Payouts Work",
    secondaryLink: "/withdrawal-policy",
  },
  {
    id: 4,
    eyebrow: "Maxi Special Combo",
    headline: (
      <>
        Multiply Your{" "}
        <span className="bg-gradient-to-r from-rose-300 to-[#FFF100] bg-clip-text text-transparent">
          Winning Odds
        </span>
      </>
    ),
    description:
      "Combine multiple predictions in a single draw with Lotto Accumulators and watch your potential return skyrocket.",
    image: "/slide-5.png",
    ctaText: "Play Accumulator",
    ctaLink: "/accumulator",
    secondaryText: "How to Play",
    secondaryLink: "/how-to-play",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6500, stopOnInteraction: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { isAuthenticated, minimalUser } = useAuthStore();

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const activeSlide = slides[selectedIndex] ?? slides[0];

  return (
    <section className="relative w-full overflow-hidden bg-[#091527] pt-24 pb-12 sm:pt-28 sm:pb-16 lg:min-h-[660px] flex items-center">
      {/* Background Slides Carousel */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef} aria-hidden>
        <div className="flex h-full w-full">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full w-full min-w-0">
              <img
                src={slide.image}
                alt=""
                fetchPriority={index === 0 ? "high" : "low"}
                decoding={index === 0 ? "sync" : "async"}
                className={cn(
                  "h-full w-full object-cover object-center transition-transform duration-1000",
                  selectedIndex === index ? "scale-105" : "scale-100",
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rich Dark Navy Gradient Overlay for guaranteed contrast */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#071121]/95 via-[#091527]/85 to-[#091527]/75"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
        aria-hidden
      />

      {/* Foreground Split Content */}
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Primary Value Proposition */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Authenticated Welcome Strip */}
            {isAuthenticated && minimalUser ? (
              <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-md">
                <span>
                  Welcome back,{" "}
                  <strong className="text-white">@{minimalUser.username}</strong>
                </span>
                <span className="text-white/40">•</span>
                <span className="tabular-nums text-[#FFF100] font-bold">
                  {formatCurrency(minimalUser.walletBalance ?? 0)}
                </span>
                <Link
                  to="/deposit"
                  className="ml-1 inline-flex items-center gap-1 rounded-full bg-white text-[#0A4B7F] px-2.5 py-0.5 text-[11px] font-extrabold hover:bg-[#FFF100] transition-colors"
                >
                  <Wallet className="w-3 h-3" /> Fund
                </Link>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#FFF100]" />
                {activeSlide.eyebrow}
              </div>
            )}

            {/* Permanent semantic H1 */}
            <h1 className="text-3xl sm:text-5xl xl:text-[3.65rem] font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
              {activeSlide.headline}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
              {activeSlide.description}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full bg-gradient-to-r from-[#ff005c] to-rose-500 hover:from-rose-500 hover:to-[#ff005c] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-rose-500/30 transition-all hover:scale-[1.02]"
              >
                <Link to={activeSlide.ctaLink as any}>{activeSlide.ctaText}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-7 rounded-full border-white/25 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md"
              >
                <Link to={activeSlide.secondaryLink as any}>
                  {activeSlide.secondaryText}
                </Link>
              </Button>
            </div>

            {/* Trust Micro-Badges + Slide Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#43f7c8]" /> Instant Payouts
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-300" /> Paystack · Sarepay · 18+
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous highlight"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-1">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => emblaApi?.scrollTo(idx)}
                      aria-label={`Show hero highlight ${idx + 1}`}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 cursor-pointer",
                        selectedIndex === idx
                          ? "w-6 bg-gradient-to-r from-cyan-400 to-[#43f7c8]"
                          : "w-2 bg-white/35 hover:bg-white/60",
                      )}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next highlight"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick-Play Widget */}
          <div className="lg:col-span-5">
            <QuickPlayWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
