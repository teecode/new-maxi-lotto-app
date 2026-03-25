import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideData {
  id: number;
  title: React.ReactNode;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: (
      <>
        Big Wins Start with
        <br />
        <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          One Game
        </span>
      </>
    ),
    description: "Play your favorite lottery games and win big prizes every day.",
    image: "/new-bg.jpg",
    ctaText: "Play Now",
    ctaLink: "/play",
  },
  {
    id: 2,
    title: "Double Your Luck! 🎁",
    description: "Get a massive 50% bonus on your very first deposit. More funds, more chances to win big!",
    image: "/slide-2.png",
    ctaText: "Claim Bonus",
    ctaLink: "/wallet",
  },
  {
    id: 3,
    title: "Keep the Wins Rolling 🔄",
    description: "Enjoy a 10% bonus on every subsequent deposit you make. The rewards never stop!",
    image: "/slide-3.png",
    ctaText: "Deposit Now",
    ctaLink: "/wallet",
  },
  {
    id: 4,
    title: "GBAM! Lightning Fast Payouts ⚡",
    description: "Fastest auto payout, your money hits your account in seconds. Win today, spend today!",
    image: "/slide-4.png",
    ctaText: "Play Now",
    ctaLink: "/play",
  },
  {
    id: 5,
    title: "Multiply Your Wins 🎯",
    description: "Boost Your Odds: Play Accumulators on your lotto and watch your potential winnings skyrocket!",
    image: "/slide-5.png",
    ctaText: "Play Accumulator",
    ctaLink: "/maxi-special-combo",
  },
  {
    id: 6,
    title: "Become a Gaming Legend 👑",
    description: "Rise through the ranks, claim your bragging rights, and become the ultimate MaxiLotto champion!",
    image: "/slide-6.png",
    ctaText: "Start Playing",
    ctaLink: "/play",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#0f172a]">
      <div className="overflow-hidden h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full touch-pan-y">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] h-full w-full min-w-0">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
                style={{
                  backgroundImage: `url('${slide.image}')`,
                  transform: selectedIndex === index ? "scale(1.05)" : "scale(1)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-transparent" />

              {/* Content */}
              <div className="container relative z-10 h-full flex items-center">
                <div className="flex flex-col gap-4 sm:gap-6 max-w-3xl pt-20">
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        key={`content-${slide.id}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col gap-4 sm:gap-6"
                      >
                        <h1 className="text-4xl sm:text-[4.2rem] font-semibold text-background tracking-[-1.92px] leading-tight decoration-skip-ink drop-shadow-lg">
                          {slide.title}
                        </h1>

                        <p className="text-xl text-background font-medium leading-relaxed max-w-lg drop-shadow-md">
                          {slide.description}
                        </p>
                        <Button
                          asChild
                          className="w-fit px-8 h-12 mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base rounded-3xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
                          size={"lg"}
                        >
                          <Link to={slide.ctaLink as any} className="text-background">
                            {slide.ctaText}
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 right-4 md:right-10 flex items-center z-20 pointer-events-none">
        <div className="flex flex-col gap-4 pointer-events-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm transition-all shadow-lg hidden sm:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm transition-all shadow-lg hidden sm:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "w-8 bg-gradient-to-r from-cyan-400 to-teal-400"
                : "w-2 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
