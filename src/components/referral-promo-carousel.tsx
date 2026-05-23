
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { Gift, Users, Coins, Trophy } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';

export default function ReferralPromoCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);

  const slides = [
    {
      id: 1,
      title: "Invite & Earn Big",
      description: "Share your unique referral link with friends and start earning a lifetime commission on every bet they place!",
      icon: Users,
      gradient: "from-blue-600 via-indigo-600 to-violet-600",
      image: "/noise.png",
      action: "Get Referral Link",
      href: "/settings/referral"
    },
    {
      id: 2,
      title: "Endless Commissions",
      description: "There's no limit to how much you can earn. Build your downline network and watch your passive income grow daily.",
      icon: Coins,
      gradient: "from-emerald-500 via-teal-600 to-cyan-600",
      image: "/noise.png",
      action: "View My Network",
      href: "/referrals"
    },
    {
      id: 3,
      title: "Special Bonus Rewards",
      description: "Hit referral milestones and unlock exclusive bonus rewards, rank upgrades, and higher commission rates!",
      icon: Gift,
      gradient: "from-rose-500 via-pink-600 to-purple-600",
      image: "/noise.png",
      action: "Learn More",
      href: "/faq"
    },
    {
      id: 4,
      title: "Become a Maxi Ambassador",
      description: "Become a Maxi Ambassador and earn 20% commission on referrals. Terms and conditions apply.",
      icon: Trophy,
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      image: "/noise.png",
      action: "Learn More",
      href: "/faq"
    }
  ];

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-1 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Referral Program</h2>
          <div className="w-8 h-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
        </div>

        <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50" ref={emblaRef}>
          <div className="flex">
            {slides.map((slide) => (
              <div className="flex-[0_0_100%] min-w-0 relative" key={slide.id}>
                <div className={`relative h-[320px] sm:h-[400px] w-full bg-gradient-to-br ${slide.gradient} overflow-hidden flex items-center`}>
                  {/* Background overlay */}
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                  
                  {/* Decorative circles */}
                  <div className="absolute top-10 right-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-black opacity-10 rounded-full blur-3xl"></div>

                  <div className="relative z-10 p-8 sm:p-16 w-full flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center justify-center p-3 sm:p-4 bg-white/20 backdrop-blur-md rounded-2xl mb-6 shadow-xl border border-white/20"
                      >
                        <slide.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </motion.div>
                      
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4"
                      >
                        {slide.title}
                      </motion.h3>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base sm:text-lg text-white/90 leading-relaxed max-w-lg mx-auto md:mx-0 mb-8 font-medium"
                      >
                        {slide.description}
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-50 font-bold rounded-full px-8 py-6 text-base shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-1">
                          <Link to={slide.href as any}>{slide.action}</Link>
                        </Button>
                      </motion.div>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center items-center relative">
                        <div className="absolute inset-0 bg-white opacity-5 rounded-full blur-2xl transform scale-150"></div>
                        <slide.icon className="w-48 h-48 text-white opacity-20 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
