import { createFileRoute } from '@tanstack/react-router'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useFetchDailyGames, useGetBetTypes } from "@/hooks/useGames"
import { usePlaceBet } from "@/hooks/usePlaceBet"
import useAuthStore from "@/store/authStore"
import type { BetList, BetType, Game } from "@/types/game"
import type { EmblaOptionsType } from 'embla-carousel'
import { ShoppingBasketIcon, Trash2Icon } from "lucide-react"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import GameCarousel from '@/components/play/game-carousel'
import { cn } from "@/lib/utils"

export const Route = createFileRoute('/_layout/accumulator')({
  component: AccumulatorPage,
})

const OPTIONS: EmblaOptionsType = { loop: true }

function AccumulatorPage() {
  const [stakeAmount, setStakeAmount] = useState<number>(100)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  
  const [accumulatorLegs, setAccumulatorLegs] = useState<{
    betType: BetType,
    selectionName: string 
  }[]>([])

  const { data: betTypes } = useGetBetTypes(2) // Fetch Accumulator BetTypes (GameType 2)
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
     
     const stakePerLeg = Math.floor(stakeAmount / accumulatorLegs.length)
     const remainder = stakeAmount % accumulatorLegs.length
     
     return accumulatorLegs.map((leg, index) => ({
         betType: leg.betType,
         selectedBalls: [], 
         stake: index === 0 ? stakePerLeg + remainder : stakePerLeg, 
         maxWinning: 0, 
         numberOfLines: 1,
         againstBalls: [],
         bankerBalls: [],
         amount: index === 0 ? stakePerLeg + remainder : stakePerLeg
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
                <div className="bg-[#0A4B7F] px-4 py-3">
                  <h3 className="text-white font-semibold">{group.title}</h3>
                </div>
                <div className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {group.items.map(bt => {
                            const isSelected = accumulatorLegs.some(l => l.betType.betTypeID === bt.betTypeID)
                            return (
                              <Button
                                key={bt.betTypeID}
                                variant={isSelected ? "primary" : "outline"} // Changed default back to primary
                                className={cn(
                                  "h-auto py-2 px-3 text-xs sm:text-sm whitespace-normal text-center min-h-[3rem]",
                                  isSelected ? "bg-[#FFF100] text-[#0A4B7F] hover:bg-[#FFF100]/90 font-bold border-[#FFF100]" : 
                                  "hover:bg-[#0A4B7F]/5 border-gray-200 text-gray-700"
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
                    <div className="bg-[#0A4B7F] text-white p-4 flex justify-between items-center">
                        <span className="font-bold flex items-center gap-2">
                            <ShoppingBasketIcon size={18} />
                            Accumulator Slip
                        </span>
                        <Badge variant="secondary" className="bg-[#FFF100] text-[#0A4B7F] hover:bg-[#FFF100]">
                            {accumulatorLegs.length} Legs
                        </Badge>
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
                                onChange={(e) => setStakeAmount(Number(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded focus:border-[#0A4B7F] focus:ring-1 focus:ring-[#0A4B7F] outline-none font-bold text-[#0A4B7F]"
                                min={50}
                            />
                         </div>
                         
                         <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                            <span className="text-sm text-green-700">Potential Win:</span>
                            <span className="font-bold text-lg text-green-700">
                                NGN {potentialWin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                         </div>
                         
                         {accumulatorLegs.length > 0 && (stakeAmount / accumulatorLegs.length) < 50 && (
                             <p className="text-center text-xs text-orange-500 bg-orange-50 p-1 rounded">
                                 Minimum stake per leg is NGN 50. Decrease legs or increase stake.
                             </p>
                         )}
                         <Button 
                            className="w-full bg-[#0A4B7F] hover:bg-[#093e6b] text-white py-6 text-lg rounded-xl shadow-lg shadow-[#0A4B7F]/20"
                            disabled={accumulatorLegs.length < 2 || !selectedGame || loading || (stakeAmount / accumulatorLegs.length) < 50}
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
