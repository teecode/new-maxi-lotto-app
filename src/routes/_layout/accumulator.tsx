import { createFileRoute } from '@tanstack/react-router'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useFetchDailyGames, useGetBetTypes, useGetBlockingRules } from "@/hooks/useGames"
import { usePlaceBet } from "@/hooks/usePlaceBet"
import useAuthStore from "@/store/authStore"
import { useBetStore } from "@/store/bet-store"
import type { BetList, BetType, Game } from "@/types/game"
import type { EmblaOptionsType } from 'embla-carousel'
import { ShoppingBasketIcon, Trash2Icon, InfoIcon } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import GameCarousel from '@/components/play/game-carousel'
import { cn } from "@/lib/utils"

export const Route = createFileRoute('/_layout/accumulator')({
  component: AccumulatorPage,
})

const OPTIONS: EmblaOptionsType = { loop: true }

// Market group descriptions for the info tooltips
const MARKET_DESCRIPTIONS: Record<string, string> = {
  "HI_LO": "Predict whether a drawn ball will be higher or lower than a specific number. For example, 'First Ball > 50' wins if the number of the first drawn ball is greater than 50.",
  "COMP": "Compare the values of specific drawn balls against each other. For example, predict whether the number of the 1st ball will be greater than the number of the 2nd ball.",
  "SUM": "Predict the total sum of all drawn balls. You bet on whether the combined total will fall above or below a certain threshold.",
  "OE": "Predict whether a specific drawn ball (or combination) will be an Odd or Even number. Simple 50/50 style market with varying odds.",
  "DEC": "Predict the decade range that a specific ball will fall into. For example, whether the number of the first drawn ball will be in the 1-10, 11-20, 21-30 range, etc.",
}

function AccumulatorPage() {
  const [stakeAmount, setStakeAmount] = useState<number>(100)
  
  // Use bet store for selected game to ensure carousel highlighting works
  const { selectedGame, setSelectedGame } = useBetStore()
  
  const MIN_STAKE = 50
  const MAX_STAKE = 10000
  const MAX_POTENTIAL_WIN = 2500000
  
  const [accumulatorLegs, setAccumulatorLegs] = useState<{
    betType: BetType,
    selectionName: string 
  }[]>([])

  const { data: betTypes } = useGetBetTypes(2) // Fetch Accumulator BetTypes (GameType 2)
  const { data: blockingRules } = useGetBlockingRules()
  const { minimalUser: user, syncUser } = useAuthStore(state => state)
  const { data: games } = useFetchDailyGames()

  // DYNAMIC GROUPING
  const groupedMarkets = useMemo(() => {
    if (!betTypes) return []

    // Filter relevant types for Accumulator
    const relevantTypes = betTypes.filter(bt => 
        bt.groupCode === "HI_LO" || 
        bt.groupCode === "COMP" || 
        bt.groupCode === "SUM" || 
        bt.groupCode === "OE" ||
        bt.groupCode === "DEC"
    );

    // Group by NAP or NapDescription
    const groups: Record<string, BetType[]> = {}
    
    relevantTypes.forEach(bt => {
        const category = bt.napDescription || bt.nap || "Other";
        if (!groups[category]) groups[category] = [];
        groups[category].push(bt);
    });

    return Object.entries(groups).map(([title, items]) => ({
        title,
        items: items.sort((a, b) => a.code.localeCompare(b.code))
    }));

  }, [betTypes])


  const handleSelectedGame = (game: Game) => {
    if (game) {
      setSelectedGame(game)
      setAccumulatorLegs([]) 
    }
  }

  const toggleLeg = (betType: BetType) => {
    if (!selectedGame) {
      toast.error("Please select a game first")
      return
    }

    const exists = accumulatorLegs.find(l => l.betType.betTypeID === betType.betTypeID)
    if (exists) {
      setAccumulatorLegs(prev => prev.filter(l => l.betType.betTypeID !== betType.betTypeID))
    } else {
      setAccumulatorLegs(prev => [...prev, { betType, selectionName: betType.description || betType.code }])
    }
  }

  const isBetDisabled = useCallback((betType: BetType) => {
      if (!blockingRules || !blockingRules.groups) return false;

      // Group iteration
      for (const group of blockingRules.groups) {
          if (group.codes.includes(betType.quickPlayCode)) {
              // Count how many selected bets are in this group
              const selectionsInGroup = accumulatorLegs.filter(leg => 
                  group.codes.includes(leg.betType.quickPlayCode)
              ).length;

              // If limit reached/exceeded
              if (group.maxSelections !== -1 && selectionsInGroup >= group.maxSelections) {
                  // Allow already selected items to remain explicitly enabled (so they can be toggled off)
                  const isAlreadySelected = accumulatorLegs.some(l => l.betType.betTypeID === betType.betTypeID);
                  if (!isAlreadySelected) {
                      return true;
                  }
              }
          }
      }
      return false;
  }, [blockingRules, accumulatorLegs]);
  
  const totalOdds = useMemo(() => {
    if (accumulatorLegs.length === 0) return 0
    return accumulatorLegs.reduce((acc, leg) => acc * leg.betType.winFactor, 1)
  }, [accumulatorLegs])

  const potentialWin = useMemo(() => {
    return totalOdds * stakeAmount
  }, [totalOdds, stakeAmount])

  // Map Accumulator Legs to BetList format for usePlaceBet
  const formattedBetsList: BetList[] = useMemo(() => {
     if (accumulatorLegs.length === 0) return []
     
     // Backend expects the FULL stake on the first bet slip for Accumulators (TicketType 2).
     // We assign the full stakeAmount to every leg for consistency/safety, backend uses the first one.
     
     return accumulatorLegs.map((leg) => ({
         betType: leg.betType,
         selectedBalls: [0], // Dummy ball to pass "NotEmpty" validation
         stake: stakeAmount, 
         maxWinning: 0, 
         numberOfLines: 1,
         againstBalls: [],
         bankerBalls: [],
         amount: stakeAmount
     }))
  }, [accumulatorLegs, stakeAmount])

  const { handlePlaceBet, loading } = usePlaceBet({
    user,
    betsList: formattedBetsList,
    selectedGame: selectedGame,
    resetAllGames: () => { 
        setAccumulatorLegs([])
        setStakeAmount(100)
    },
    syncUser,
    ticketType: 2 // Accumulator
  })

  return (
    <section className="py-8 sm:py-12 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Game Selection */}
        {games && (
          <GameCarousel handleSelectedGame={handleSelectedGame} games={games} options={OPTIONS} />
        )}
        <Separator className="my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Markets */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#0A4B7F]">Accumulator Markets</h1>
                <Badge variant="secondary" className="text-xs">Sports Mode</Badge>
            </div>

            {!selectedGame && (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500">Please select a game from the carousel above to view markets.</p>
                </div>
            )}

            {selectedGame && groupedMarkets.map(group => (
              <div key={group.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#0A4B7F] px-4 py-3 flex items-center justify-between">
                  <h3 className="text-white font-semibold">{group.title}</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                        aria-label={`Info about ${group.title}`}
                      >
                        <InfoIcon size={16} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="top"
                      align="end"
                      className="w-72 text-sm bg-white shadow-xl border border-gray-200 rounded-xl p-4"
                    >
                      <div className="space-y-2">
                        <h4 className="font-bold text-[#0A4B7F] flex items-center gap-1.5">
                          <InfoIcon size={14} className="text-[#0A4B7F]" />
                          {group.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed">
                          {MARKET_DESCRIPTIONS[group.items[0]?.groupCode] || "Select options from this market to add them as legs to your accumulator bet."}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {group.items.map(bt => {
                            const isSelected = accumulatorLegs.some(l => l.betType.betTypeID === bt.betTypeID)
                            const isDisabled = isBetDisabled(bt);
                            return (
                              <Button
                                key={bt.betTypeID}
                                disabled={isDisabled}
                                variant={isSelected ? "primary" : "outline"} // Changed default back to primary
                                className={cn(
                                  "h-auto py-2 px-3 text-xs sm:text-sm whitespace-normal text-center min-h-[3rem]",
                                  isSelected ? "bg-[#FFF100] text-[#0A4B7F] hover:bg-[#FFF100]/90 font-bold border-[#FFF100]" : 
                                  "hover:bg-[#0A4B7F]/5 border-gray-200 text-gray-700",
                                  isDisabled && "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100 border-gray-100"
                                )}
                                onClick={() => toggleLeg(bt)}
                              >
                                <div className="flex flex-col items-center gap-1">
                                  <span>{bt.description || bt.code.replace(/_/g, " ")}</span>
                                  <span className="text-[10px] bg-gray-100 px-1.5 rounded-full text-gray-600 font-mono">
                                    {bt.winFactor.toFixed(2)}
                                  </span>
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Slip */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
                <div className="bg-white rounded-xl shadow-lg border border-[#0A4B7F]/20 overflow-hidden">
                    <div className="bg-[#0A4B7F] text-white p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="font-bold flex items-center gap-2">
                                <ShoppingBasketIcon size={18} />
                                Accumulator Slip
                            </span>
                            <Badge variant="secondary" className="bg-[#FFF100] text-[#0A4B7F] hover:bg-[#FFF100]">
                                {accumulatorLegs.length} Legs
                            </Badge>
                        </div>
                        {accumulatorLegs.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setAccumulatorLegs([])
                                setStakeAmount(100)
                                toast.success("All selections cleared!")
                              }}
                              className="text-white/80 hover:text-white hover:bg-white/20 h-7 text-xs font-semibold flex items-center gap-1"
                            >
                              <Trash2Icon size={12} /> Clear All
                            </Button>
                        )}
                        {selectedGame && (
                            <div className="text-xs bg-[#093e6b] p-2 rounded text-white/90 flex justify-between items-center">
                                <span>Game:</span>
                                <span className="font-semibold text-white">{selectedGame.gameName}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                        {accumulatorLegs.length === 0 ? (
                             <div className="text-center py-8 text-gray-400 text-sm">
                                <p>No bets selected.</p>
                                <p>Click markets to add legs.</p>
                             </div>
                        ) : (
                            <div className="space-y-2">
                                {accumulatorLegs.map((leg, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
                                        <div>
                                            <p className="font-medium text-sm text-[#0A4B7F]">{leg.selectionName}</p>
                                            <p className="text-xs text-muted-foreground">{leg.betType.code}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="bg-white">{leg.betType.winFactor.toFixed(2)}</Badge>
                                            <button onClick={() => toggleLeg(leg.betType)} className="text-red-400 hover:text-red-600">
                                                <Trash2Icon size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4 bg-gray-50 space-y-4">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Total Odds:</span>
                            <span className="font-bold text-lg text-[#0A4B7F]">{totalOdds.toFixed(2)}</span>
                         </div>
                         
                         <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Stake Amount (NGN)</label>
                            <input 
                                type="number" 
                                value={stakeAmount}
                                onChange={(e) => {
                                  const value = Number(e.target.value)
                                  // Prevent negative values
                                  if (value < 0) {
                                    setStakeAmount(0)
                                  } else {
                                    setStakeAmount(value)
                                  }
                                }}
                                className={cn(
                                    "w-full p-2 border rounded focus:ring-1 outline-none font-bold",
                                    (stakeAmount < MIN_STAKE || stakeAmount > MAX_STAKE) 
                                        ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500" 
                                        : "border-gray-300 text-[#0A4B7F] focus:border-[#0A4B7F] focus:ring-[#0A4B7F]"
                                )}
                                min={0}
                                max={MAX_STAKE}
                            />
                            {(stakeAmount < MIN_STAKE || stakeAmount > MAX_STAKE) && (
                                <p className="text-xs text-red-500">
                                    {stakeAmount < MIN_STAKE ? `Minimum stake is NGN ${MIN_STAKE}` : `Maximum stake is NGN ${MAX_STAKE.toLocaleString()}`}
                                </p>
                            )}
                         </div>
                         
                         <div className="flex justify-between items-center p-3 bg-teal-50 rounded border border-teal-100">
                            <span className="text-sm text-teal-700">Potential Win:</span>
                            <span className={cn("font-bold text-lg", potentialWin > MAX_POTENTIAL_WIN ? "text-red-600" : "text-teal-700")}>
                                NGN {potentialWin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                         </div>
                         
                         {potentialWin > MAX_POTENTIAL_WIN && (
                             <p className="text-center text-xs text-red-500 bg-red-50 p-1 rounded">
                                 Maximum potential winning cannot exceed NGN {MAX_POTENTIAL_WIN.toLocaleString()}
                             </p>
                         )}

                         <Button 
                            className="w-full bg-[#0A4B7F] hover:bg-[#093e6b] text-white py-6 text-lg rounded-xl shadow-lg shadow-[#0A4B7F]/20"
                            disabled={
                                accumulatorLegs.length < 2 || 
                                !selectedGame || 
                                loading || 
                                stakeAmount < MIN_STAKE || 
                                stakeAmount > MAX_STAKE || 
                                potentialWin > MAX_POTENTIAL_WIN
                            }
                            onClick={handlePlaceBet}
                         >
                            {loading ? "Processing..." : "Place Bet"}
                         </Button>
                         
                         {accumulatorLegs.length === 1 && (
                             <p className="text-center text-xs text-red-500 bg-red-50 p-1 rounded">
                                 Accumulators require at least 2 selections.
                             </p>
                         )}
                    </div>
                </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
