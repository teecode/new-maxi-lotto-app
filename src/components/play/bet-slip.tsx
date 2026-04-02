import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { BetList, BetType, Game } from '@/types/game'
import { useEffect, useState } from 'react'
import { fetchDailyStakeSum } from '@/services/GameService'
import { toast } from 'sonner'

interface BetSlipProps {
  selectedBalls: number[]
  bankerBalls: number[]
  againstBalls: number[]
  selectedBetType: BetType
  collisionCount: number
  betLists: BetList[]
  setSelectedBalls: React.Dispatch<React.SetStateAction<number[]>>
  setBankerBalls: React.Dispatch<React.SetStateAction<number[]>>
  setAgainstBalls: React.Dispatch<React.SetStateAction<number[]>>
  setSelectedBetType: React.Dispatch<React.SetStateAction<BetType | null>>
  selectedGame: Game | null
  handleResetBetSlips?: () => void // Make optional since we're not using it in reset
  selectionMode: "normal" | "banker" | "against"
  isMainBall: boolean,
  addBet: (betList: BetList) => void,
}

// Factorial calculation
const factorial = (r: number): number => {
  if (r <= 1) return 1
  return r * factorial(r - 1)
}

// Combination calculation
const combination = (n: number, r: number): number => {
  if (n < r) return 0
  return Math.round(factorial(n) / (factorial(n - r) * factorial(r)))
}

const BetSlip = ({
                   selectedBalls,
                   selectedBetType,
                   againstBalls,
                   addBet,
                   selectedGame,
                   setAgainstBalls,
                   setSelectedBalls,
                   betLists
                 }: BetSlipProps) => {

  const [stake, setStake] = useState<number>(0)
  const [maxWinning, setMaxWinning] = useState<number>(0)
  const [numberOfLines, setNumberOfLines] = useState<number>(0)

  // Calculate collision count (following Vue logic)
  const collisionCount = () => {
    if (selectedBalls.length === 0 || againstBalls.length === 0) return 0
    return selectedBalls.filter((ball) => againstBalls.includes(ball)).length
  }

  // Calculate max winning (following Vue logic exactly)
  const calculateMaxWinning = () => {
    if (!selectedBetType) return 0
    if (selectedBalls.length < selectedBetType.minimumNumberOfBalls) return 0

    const code = selectedBetType.code
    const nap = selectedBetType.nap

    // BANKER logic
    if (code === 'BANKER') {
      if (selectedBalls.length > 1) {
        return 5 * (stake || 5) * selectedBetType.winFactor
      }
      return 0
    }

    // AGAINST (AG) logic
    if (nap === 'AG') {
      // @ts-ignore
      const maxBall = (selectedBalls.length + againstBalls.length) > 5
        ? 5
        : (selectedBalls.length + againstBalls.length)
      const noOfLines = selectedBalls.length * againstBalls.length - collisionCount()
      return noOfLines * stake * selectedBetType.winFactor
    }

    // AGAINST SINGLES (AGS) logic
    if (nap === 'AGS') {
      const noOfLines = selectedBalls.length * againstBalls.length - collisionCount()
      return noOfLines * stake * selectedBetType.winFactor
    }

    // DIRECT/PERM logic
    const maxBall = selectedBalls.length > 5 ? 5 : selectedBalls.length
    const noOfLines = combination(maxBall, selectedBetType.minimumNumberOfBalls)
    return noOfLines * stake * selectedBetType.winFactor
  }

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    
    // Prevent negative values
    if (value < 0) {
      toast.error('Stake cannot be negative')
      setStake(0)
      return
    }
    
    if (value > selectedBetType.maximumStake) {
      toast.error(`Maximum stake is ₦${selectedBetType.maximumStake}`)
      setStake(selectedBetType.maximumStake)
      return
    }
    setStake(value)
  }

  // Calculate lines and max winning (following Vue logic)
  useEffect(() => {
    if (!selectedBetType) {
      setNumberOfLines(0)
      setMaxWinning(0)
      return
    }

    let lines = 0
    const code = selectedBetType.code
    const nap = selectedBetType.nap

    // BANKER: Always 89 lines when 1 ball selected
    if (code === 'BANKER') {
      lines = selectedBalls.length === 1 ? 89 : 0
    }
    // AGAINST SINGLES (AGS)
    else if (nap === 'AGS') {
      if (selectedBalls.length >= 1 && againstBalls.length >= 1) {
        lines = selectedBalls.length * againstBalls.length - collisionCount()
      }
    }
    // DIRECT/PERM
    else {
      if (selectedBalls.length >= selectedBetType.minimumNumberOfBalls) {
        lines = combination(selectedBalls.length, selectedBetType.minimumNumberOfBalls)
      }
    }

    setNumberOfLines(lines)
    setMaxWinning(calculateMaxWinning())
  }, [selectedBalls, againstBalls, stake, selectedBetType])

  const handleAddToBets = async () => {
    if (!selectedGame) return toast.error("Please select a game first")
    if (!selectedBetType) return toast.error("Select a bet type first")

    const code = selectedBetType.code
    const nap = selectedBetType.nap

    if (stake < selectedBetType.minimumStake || stake > selectedBetType.maximumStake)
      return toast.error(`Stake must be between ₦${selectedBetType.minimumStake} and ₦${selectedBetType.maximumStake}`)

    // Validation (following Vue logic)
    if (code === 'BANKER') {
      if (selectedBalls.length !== 1)
        return toast.error("Select exactly 1 Banker ball.")
    } else if (nap === 'AGS') {
      if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
        return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} Main ball(s).`)
      if (againstBalls.length < 1)
        return toast.error("Select at least 1 Against ball.")
    } else {
      if (selectedBalls.length < selectedBetType.minimumNumberOfBalls)
        return toast.error(`Select at least ${selectedBetType.minimumNumberOfBalls} ball(s).`)
    }

    // Calculate total stake (lines * stake per line)
    const totalAmount = numberOfLines * stake

    const newBet: BetList = {
      betType: selectedBetType,
      selectedBalls: [...selectedBalls],
      bankerBalls: code === 'BANKER' ? [...selectedBalls] : [],
      againstBalls: nap === 'AGS' ? [...againstBalls] : [],
      stake: totalAmount,
      amount: stake,
      maxWinning,
      numberOfLines,
    }

    addBet(newBet)
    resetBetSlip()
    toast.success("Bet added successfully!")

    if (betLists.length === 0) {
      try {
        const result = await fetchDailyStakeSum();
        if (result && result.sum >= 100000) {
          toast.info(`Friendly Reminder: You have staked a total of ₦${result.sum.toLocaleString()} today. Please gamble safely.`, { duration: 5000 });
        }
      } catch (e) {
        // ignore
      }
    }

    // Scroll to games list after adding
    setTimeout(() => {
      document.getElementById("gamesListSection")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 300)
  }

  const resetBetSlip = () => {
    setStake(0)
    setMaxWinning(0)
    setAgainstBalls([])
    setSelectedBalls([])
    // Don't call handleResetBetSlips here to avoid scrolling to top
  }

  return (
    <div className={cn("bg-white rounded-2xl shadow-lg w-full overflow-hidden border border-gray-100")}>
      
      {/* Modern Header with Gradient */}
      <div className="relative bg-gradient-to-r from-[#0185B6] to-[#01B1A8] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FFF100] rounded-full animate-pulse"></div>
            <h3 className="text-white font-bold text-lg tracking-wide">Bet Slip</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-white text-xs font-semibold">Quick Add</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Game and Bet Type - Compact Header */}
        <div className="text-center pb-3 border-b-2 border-dashed border-gray-200">
          <div className="text-base font-bold text-[#0A4B7F]">
            {selectedGame?.gameName || "Select Game"} : {selectedBetType?.code || "N/A"}
          </div>
        </div>

        {/* Bet Numbers Display - Aesthetically Pleasing */}
        {selectedBetType && (
          <div className="space-y-3">
            {/* Main Bets */}
            <div className="bg-gradient-to-r from-[#1FEFBC]/10 to-[#0185B6]/10 rounded-xl p-3 border border-[#0185B6]/20">
              <div className="text-xs font-semibold text-gray-600 mb-2">Selected Numbers</div>
              <div className="flex flex-wrap gap-2">
                {selectedBalls.length > 0 ? (
                  selectedBalls.map((ball, index) => (
                    <span 
                      key={index}
                      className="bg-[#0185B6] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md"
                    >
                      {ball}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm italic">No balls selected</span>
                )}
                {selectedBetType.code === 'BANKER' && selectedBalls.length > 0 && (
                  <span className="bg-[#FFF100] text-[#0A4B7F] px-3 py-1 rounded-full text-sm font-bold">
                    AG 1-90
                  </span>
                )}
              </div>
            </div>

            {/* Against Balls for AGS */}
            {selectedBetType.nap === 'AGS' && againstBalls.length > 0 && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-3 border border-red-200">
                <div className="text-xs font-semibold text-gray-600 mb-2">Against Numbers</div>
                <div className="flex flex-wrap gap-2">
                  {againstBalls.map((ball, index) => (
                    <span 
                      key={index}
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md"
                    >
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Calculation Summary */}
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
              <div className="flex justify-between items-center font-semibold text-gray-700">
                <span>{numberOfLines} lines × ₦{stake || 0}</span>
                <span className="text-[#0A4B7F]">= ₦{(numberOfLines * stake).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-green-700 font-bold">Possible Winning:</span>
                <span className="text-green-600 font-bold text-lg">₦{maxWinning.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Input Field for Stake */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600">Stake Per Line</label>
          <Input
            id="stake"
            placeholder="Enter amount"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={stake === 0 ? '' : stake}
            onChange={handleStakeChange}
            className="border-2 border-[#0185B6]/30 focus:border-[#0185B6] rounded-xl px-4 py-3 text-center font-bold text-lg"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Min: ₦{selectedBetType?.minimumStake}</span>
            <span>Max: ₦{selectedBetType?.maximumStake}</span>
          </div>
        </div>

        {/* Add Game Button */}
        <Button
          onClick={handleAddToBets}
          size={"lg"}
          className="w-full bg-gradient-to-r from-[#0185B6] to-[#01B1A8] text-[#FFF100] rounded-xl py-6 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          Add to My Games
        </Button>
      </div>
    </div>
  )
}

export default BetSlip