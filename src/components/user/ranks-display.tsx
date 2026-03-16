
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogBody
} from "@/components/ui/dialog";
import { RankDefinition, RANKS, getRankByName } from "@/lib/ranks";
import { Trophy, Star, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RanksDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  currentRankName: string;
}

export function RanksDisplay({ isOpen, onClose, currentRankName }: RanksDisplayProps) {
  const [showGrowth, setShowGrowth] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRank = getRankByName(currentRankName) || RANKS[0];
  const currentLevel = currentRank.level;

  useEffect(() => {
    if (isOpen) {
      // Small Delay before showing growth animation
      const timer = setTimeout(() => setShowGrowth(true), 100);
      
      // Play clapping sound
      if (!audioRef.current) {
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3");
      }
      audioRef.current.play().catch(e => console.log("Audio playback failed", e));

      return () => {
        clearTimeout(timer);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    } else {
      setShowGrowth(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border-slate-200/50 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
                Rank Progression
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                Climb the ranks and unlock exclusive rewards
              </DialogDescription>
            </div>
            <div 
              className="px-4 py-2 rounded-2xl border shadow-sm flex items-center gap-2"
              style={{ borderColor: `${currentRank.color}40`, backgroundColor: `${currentRank.color}10` }}
            >
              <Star className="w-4 h-4" style={{ color: currentRank.color }} fill={currentRank.color} />
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: currentRank.color }}>
                {currentRank.name}
              </span>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="p-0">
          <div className="space-y-0">
            {/* Growth Progress Area */}
            <div className="bg-slate-50/50 p-8 border-y border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />
               
               <div className="relative z-10 space-y-6">
                 <div className="flex justify-between items-end">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Progress</p>
                     <p className="text-3xl font-black text-slate-900">Level {currentRank.level}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Growth Score</p>
                     <p className="text-xl font-bold text-slate-700">{Math.round((currentLevel / RANKS.length) * 100)}%</p>
                   </div>
                 </div>

                 {/* Animated Progress Bar */}
                 <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner ring-4 ring-white">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: showGrowth ? `${(currentLevel / RANKS.length) * 100}%` : 0 }}
                     transition={{ duration: 2, ease: "easeOut" }}
                     className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-slate-900 relative"
                   >
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                     <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute top-0 right-0 w-8 h-full bg-white/30 skew-x-[30deg]" 
                     />
                   </motion.div>
                 </div>

                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
                   <span>Newbie</span>
                   <span>GOAT</span>
                 </div>
               </div>
            </div>

            {/* Scrollable Rank List */}
            <div className="max-h-[400px] overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="grid gap-3">
                {RANKS.map((rank, index) => {
                  const isUnlocked = rank.level <= currentLevel;
                  const isCurrent = rank.level === currentLevel;
                  const isNext = rank.level === currentLevel + 1;

                  return (
                    <motion.div
                      key={rank.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "group relative flex items-center gap-4 p-4 rounded-3xl border transition-all duration-300",
                        isUnlocked ? "bg-white border-slate-100 shadow-sm" : "bg-slate-50/50 border-transparent grayscale opacity-60",
                        isCurrent && "ring-2 ring-slate-900 ring-offset-2 scale-[1.02] shadow-xl z-20 bg-white"
                      )}
                    >
                      {/* Rank Icon/Level */}
                      <div 
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 shadow-md",
                          isUnlocked ? "text-white" : "bg-slate-200 text-slate-400"
                        )}
                        style={isUnlocked ? { backgroundColor: rank.color } : {}}
                      >
                        {isUnlocked ? (
                          isCurrent ? <Trophy className="w-6 h-6" /> : index + 1
                        ) : (
                          <Lock className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      {/* Rank Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "text-sm font-black uppercase tracking-wider truncate",
                            isUnlocked ? "text-slate-900" : "text-slate-400"
                          )}>
                            {rank.name}
                          </h4>
                          {isCurrent && (
                            <span className="bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter">Current</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Star className="w-3 h-3" /> {rank.minWins} Wins
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-bold text-slate-400">
                            {formatCurrency(rank.minAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="shrink-0">
                         {isUnlocked ? (
                           <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                         ) : (
                           isNext && (
                             <div className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center">
                               <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" />
                             </div>
                           )
                         )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
