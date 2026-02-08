import { toast } from "sonner"
import { placeBet } from "@/services/GameService"
import { useState } from "react"
import type { MinimalUser } from "@/types/user"
import type { BetList } from "@/types/game"
import { useQueryClient } from "@tanstack/react-query"

interface PlaceBetProps {
  user?: MinimalUser | null
  betsList: BetList[]
  selectedGame: { gameID: number } | null
  resetAllGames: () => void
  syncUser: () => Promise<void>
  ticketType?: number // Added
}

export const usePlaceBet = ({
  user,
  betsList,
  selectedGame,
  resetAllGames,
  syncUser,
  ticketType // Added
}: PlaceBetProps) => {

  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient();

  const handlePlaceBet = async () => {
    // ... (Checks 1 & 2 remain the same) ...

    if (!betsList.length) {
      toast.error("No game played")
      return
    }

    if (!user) {
      toast.error("You need to login before placing a bet")
      return
    }

    try {
      setLoading(true)

      // ✅ 3. Prepare payload (remains the same)
      const payload = {
        customerID: user.customerId || 0,
        dailyGameId: selectedGame?.gameID || 0,
        ticketType: ticketType // Passed here
      }

      // ✅ 4. Map bets - THIS IS WHERE WE APPLY THE LOGIC
      const betSlips = betsList.map((value) => {
        const code = value.betType.code.toUpperCase()

        let bet1: number[] = [] // Core Numbers
        let bet2: number[] = [] // Opponent / System Numbers
        let numOfLines: number = value.numberOfLines

        // --- MAPPING LOGIC START ---

        if (code.includes("BANKER")) {
          // 1. BANKER AGAINST ALL (1 vs. 89)
          // bet1: The single banker ball.
          // bet2: The 89 opponent balls (this was calculated and stored in againstBalls).
          bet1 = value.bankerBalls // Should contain 1 number
          bet2 = [1, 90] // Should contain 89 numbers

          // We must use the calculated 89 lines here
          numOfLines = 89

        } else if (code.includes("AGAINST")) {
          // 2. AGAINST SINGLES (Main vs. Against)
          // bet1: The Main group (selectedBalls).
          // bet2: The Against group (againstBalls).
          bet1 = value.selectedBalls
          bet2 = value.againstBalls

        } else {
          // 3. DIRECT / PERM (Standard Bet)
          // bet1: The selected balls (core).
          // bet2: Should be an empty array or [0] as a placeholder for standard bets.
          bet1 = value.selectedBalls
          bet2 = [0] // Placeholder for standard bets

          // Lines are already correctly calculated in BetSlip
        }

        // --- MAPPING LOGIC END ---

        return {
          bet1: bet1,
          bet2: bet2,
          betTypeId: value.betType.betTypeID,
          stakeperline: value.amount,
          lines: numOfLines,
        }
      })

      // ✅ 5. Send to backend
      const response = await placeBet(payload, betSlips)

      // ... (Error handling and state management remain the same) ...
      if (response) {
        await queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        toast.success("Bet placed successfully!")
        resetAllGames()
        await syncUser()
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "An error occurred while placing your bet")
    } finally {
      setLoading(false)
    }
  }

  return { handlePlaceBet, loading }
}