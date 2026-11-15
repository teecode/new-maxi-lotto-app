import {createFileRoute} from '@tanstack/react-router'
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {useFetchDailyGames, useGetBetTypes, useGetBlockingRules} from "@/hooks/useGames"
import {usePlaceBet} from "@/hooks/usePlaceBet"
import useAuthStore from "@/store/authStore"
import {useBetStore} from "@/store/bet-store"
import type {BetList, BetType, Game} from "@/types/game"
import type {EmblaOptionsType} from 'embla-carousel'
import {Gift, InfoIcon, PlusCircle, ShoppingBasketIcon, Trash2Icon, Wallet} from "lucide-react"
import {useCallback, useEffect, useMemo, useState} from "react"
import {toast} from "sonner"
import GameCarousel from '@/components/play/game-carousel'
import {BookedTicketDialog} from '@/components/play/booked-ticket-dialog'
import {MiniDepositWidget} from '@/components/deposit/mini-deposit-widget'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {Skeleton} from '@/components/ui/skeleton'
import {cn, formatCurrency} from "@/lib/utils"
import {sortGamesForPlay} from "@/lib/sort-games"
import {isGameClosed} from "@/lib/game-time"
import PageHeader from "@/components/layouts/page-header.tsx";
import { ContentSections } from '@/components/content/content-sections'
import { ACCUMULATOR_SECTIONS } from '@/content/accumulator'
import VoucherPicker from '@/components/play/voucher-picker'
import {useRuleNames} from '@/components/bonus/voucher-card'
import {useMyVouchers, useRefreshBonuses} from '@/hooks/useBonusPromotions'
import {ACCUMULATOR, checkVoucher, naira, ticketTypeFits} from '@/lib/bonus-words'

export const Route = createFileRoute('/_layout/accumulator')({
  component: AccumulatorPage,
  // ?voucher=<id>: arrive ready to pay with that free ticket ("Play an accumulator" on a voucher)
  validateSearch: (search: Record<string, unknown>): { voucher?: string } =>
    search.voucher ? {voucher: String(search.voucher)} : {},
})

const OPTIONS: EmblaOptionsType = {loop: true}

// Market group descriptions for the info tooltips
const MARKET_DESCRIPTIONS: Record<string, string> = {
  "HI_LO": "Predict whether a drawn ball will be higher or lower than a specific number. For example, 'First Ball > 50' wins if the number of the first drawn ball is greater than 50.",
  "COMP": "Compare the values of specific drawn balls against each other. For example, predict whether the number of the 1st ball will be greater than the number of the 2nd ball.",
  "SUM": "Predict the total sum of all drawn balls. You bet on whether the combined total will fall above or below a certain threshold.",
  "OE": "Predict whether a specific drawn ball (or combination) will be an Odd or Even number. Simple 50/50 style market with varying odds.",
  "DEC": "Predict the decade range that a specific ball will fall into. For example, whether the number of the first drawn ball will be in the 1-10, 11-20, 21-30 range, etc.",
  "PRIME_F": "Predict if the First Ball drawn will be a Prime Number (divisible only by 1 and itself).",
  "PRIME_L": "Predict if the Last Ball drawn will be a Prime Number.",
  "SQR_F": "Predict if the First Ball drawn will be a Perfect Square (e.g. 1, 4, 9, 16, 25...).",
  "SQR_L": "Predict if the Last Ball drawn will be a Perfect Square.",
  "SEQ": "Predict if the 5 winning numbers will follow a specific sequence pattern (Strictly Increasing or Decreasing).",
  "SUM_OE": "Predict whether the sum of all 5 balls will be Odd or Even.",
  "MOD3_F": "Predict the remainder when the First Ball is divided by 3.",
}

function AccumulatorPage() {
  const [stakeAmount, setStakeAmount] = useState<number>(100)
  const [winningType, setWinningType] = useState<number>(1) // 1: Normal, 2: Machine
  const [activeCategory, setActiveCategory] = useState<string>("ALL")
  const [depositOpen, setDepositOpen] = useState<boolean>(false)

  // Use bet store for selected game to ensure carousel highlighting works
  const {selectedGame, setSelectedGame} = useBetStore()

  const MIN_STAKE = 50
  const MAX_POTENTIAL_WIN = 500000

  const [accumulatorLegs, setAccumulatorLegs] = useState<{
    betType: BetType,
    selectionName: string
  }[]>([])

  const {data: betTypes, isLoading: betTypesLoading} = useGetBetTypes(2) // Fetch Accumulator BetTypes (GameType 2)
  const {data: blockingRules} = useGetBlockingRules()
  const {isAuthenticated, minimalUser: user, syncUser} = useAuthStore(state => state)
  const {data: games, isLoading: gamesLoading} = useFetchDailyGames()

  const sortedGames = useMemo(() => (games ? sortGamesForPlay(games) : []), [games])

  useEffect(() => {
    if (!selectedGame && sortedGames.length > 0) {
      const firstOpen = sortedGames.find((g) => !isGameClosed(g.endDateTime))
      if (firstOpen) setSelectedGame(firstOpen)
    }
  }, [selectedGame, sortedGames, setSelectedGame])

  // DYNAMIC GROUPING
  const groupedMarkets = useMemo(() => {
    if (!betTypes) return []

    // Filter relevant types for Accumulator
    const relevantTypes = betTypes.filter(bt =>
      bt.groupCode === "HI_LO" ||
      bt.groupCode === "COMP" ||
      bt.groupCode === "SUM" ||
      bt.groupCode === "OE" ||
      bt.groupCode === "DEC" ||
      bt.groupCode === "PRIME_F" ||
      bt.groupCode === "PRIME_L" ||
      bt.groupCode === "SQR_F" ||
      bt.groupCode === "SQR_L" ||
      bt.groupCode === "SEQ" ||
      bt.groupCode === "SUM_OE" ||
      bt.groupCode === "MOD3_F"
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
      setAccumulatorLegs(prev => [...prev, {betType, selectionName: betType.description || betType.code}])
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
      amount: stakeAmount,
      winningType: winningType
    }))
  }, [accumulatorLegs, stakeAmount, winningType])

  // Free tickets that pay for an accumulator (not the 5/90-only ones). An accumulator stakes once, whatever its
  // legs, so the stake must fit the free ticket; choosing one lowers a bigger stake to its value.
  const search = Route.useSearch()
  const {data: myVouchers = []} = useMyVouchers()
  const vouchers = useMemo(() => myVouchers.filter(v => ticketTypeFits(v.ticketType, ACCUMULATOR)), [myVouchers])
  const refreshBonuses = useRefreshBonuses()
  const {gameName, betTypeName} = useRuleNames()
  const [voucherId, setVoucherId] = useState<string | null>(null)
  const [voucherFromLink, setVoucherFromLink] = useState(false)
  const chooseVoucher = useCallback((id: string | null) => {
    setVoucherId(id)
    const chosen = vouchers.find(v => String(v.id) === id)
    if (chosen) setStakeAmount(stake => Math.min(stake, chosen.amount))
  }, [vouchers])
  useEffect(() => {
    if (search.voucher && !voucherFromLink && vouchers.some(v => String(v.id) === search.voucher)) {
      chooseVoucher(search.voucher)
      setVoucherFromLink(true)
    }
  }, [search.voucher, vouchers, voucherFromLink, chooseVoucher])
  // A voucher that has just been used (or expired) drops out of the choice
  useEffect(() => {
    if (voucherId && vouchers.length && !vouchers.some(v => String(v.id) === voucherId)) setVoucherId(null)
  }, [vouchers, voucherId])
  const voucher = vouchers.find(v => String(v.id) === voucherId) ?? null
  const voucherCheck = voucher && formattedBetsList.length
    ? checkVoucher(voucher, formattedBetsList, selectedGame, gameName, betTypeName, ACCUMULATOR)
    : null
  const linkedVoucher = search.voucher ? vouchers.find(v => String(v.id) === search.voucher) : undefined

  const {
    handlePlaceBet,
    loading,
    handleBookBet,
    bookingLoading,
    bookedTicketId,
    setBookedTicketId
  } = usePlaceBet({
    user,
    betsList: formattedBetsList,
    selectedGame: selectedGame,
    resetAllGames: () => {
      setAccumulatorLegs([])
      setStakeAmount(100)
    },
    syncUser,
    ticketType: 2, // Accumulator
    voucherId: voucher && voucherCheck?.ok ? voucherId : null,
    onVoucherUsed: () => {
      setVoucherId(null)
      refreshBonuses()
    }
  })

  return (
    <>
      <PageHeader title="Lotto Accumulator" subtitle="Combine predictions for one game and multiply the odds" />
      <section className="py-8 sm:py-12 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          {linkedVoucher && accumulatorLegs.length === 0 && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF100] text-[#0A4B7F]">
                <Gift className="h-5 w-5" aria-hidden/>
              </span>
              <div className="text-sm">
                <p className="font-bold text-[#0A4B7F]">Your {naira(linkedVoucher.amount)} free accumulator ticket is ready</p>
                <p className="text-slate-600">
                  Pick a game, add at least 2 selections and keep the stake at {naira(linkedVoucher.amount)} or less.
                  It is paid with your free ticket, not from your wallet.
                </p>
              </div>
            </div>
          )}
          {/* Game Selection */}
          {gamesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {Array.from({length: 3}).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : sortedGames.length > 0 ? (
            <GameCarousel handleSelectedGame={handleSelectedGame} games={sortedGames} options={OPTIONS}/>
          ) : null}
          <Separator className="my-6"/>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT: Markets */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold text-[#0A4B7F]">Accumulator Markets</h2>
                  <Badge variant="secondary" className="text-xs">Combo Mode</Badge>
                </div>

                {isAuthenticated && user && (
                  <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-[#0A4B7F] shadow-sm">
                      <Wallet className="w-3.5 h-3.5 text-[#0185B6]" />
                      <span className="tabular-nums">{formatCurrency(user.walletBalance ?? 0)}</span>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full bg-[#FFF100] text-[#0A4B7F] px-2.5 py-0.5 text-[11px] font-black hover:bg-[#ffe84a] transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3 h-3" /> Top Up
                        </button>
                      </DialogTrigger>
                    </div>
                    <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
                      <DialogHeader className="sr-only">
                        <DialogTitle>Quick Wallet Deposit</DialogTitle>
                      </DialogHeader>
                      <MiniDepositWidget user={user} onSuccess={() => setDepositOpen(false)} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {/* Market Category Filter Pills */}
              {selectedGame && groupedMarkets.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("ALL")}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border",
                      activeCategory === "ALL"
                        ? "bg-[#0A4B7F] text-white border-[#0A4B7F] shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#0A4B7F]/40"
                    )}
                  >
                    All Markets ({groupedMarkets.length})
                  </button>
                  {groupedMarkets.map((g) => (
                    <button
                      key={g.title}
                      type="button"
                      onClick={() => setActiveCategory(g.title)}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border",
                        activeCategory === g.title
                          ? "bg-[#0A4B7F] text-white border-[#0A4B7F] shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#0A4B7F]/40"
                      )}
                    >
                      {g.title}
                    </button>
                  ))}
                </div>
              )}

              {!selectedGame && (
                <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200">
                  <p className="text-gray-500">Please select a game from the carousel above to view markets.</p>
                </div>
              )}

              {selectedGame && betTypesLoading && (
                <div className="space-y-4">
                  {Array.from({length: 3}).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl bg-slate-200" />
                  ))}
                </div>
              )}

              {selectedGame &&
                groupedMarkets
                  .filter((group) => activeCategory === "ALL" || group.title === activeCategory)
                  .map(group => (
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
                          <InfoIcon size={16}/>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="top"
                        align="end"
                        className="w-72 text-sm bg-white shadow-xl border border-gray-200 rounded-xl p-4"
                      >
                        <div className="space-y-2">
                          <h4 className="font-bold text-[#0A4B7F] flex items-center gap-1.5">
                            <InfoIcon size={14} className="text-[#0A4B7F]"/>
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
                            title={isDisabled ? "Conflicts with an existing selection in this market group" : undefined}
                            variant={isSelected ? "primary" : "outline"}
                            className={cn(
                              "h-auto py-2.5 px-3 text-xs sm:text-sm whitespace-normal text-center min-h-[3.25rem]",
                              isSelected ? "bg-[#FFF100] text-[#0A4B7F] hover:bg-[#FFF100]/90 font-bold border-[#FFF100]" :
                                "hover:bg-[#0A4B7F]/5 border-gray-200 text-gray-700",
                              isDisabled && "opacity-45 cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100 border-gray-100"
                            )}
                            onClick={() => toggleLeg(bt)}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span>{bt.description || bt.code.replace(/_/g, " ")}</span>
                              <span className={cn(
                                "text-[10px] px-1.5 rounded-full font-mono tabular-nums",
                                isSelected ? "bg-[#0A4B7F]/10 text-[#0A4B7F]" : "bg-gray-100 text-gray-600"
                              )}>
                                {isDisabled ? "Blocked" : `${bt.winFactor.toFixed(2)}×`}
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
            <div className="lg:col-span-1" id="accumulatorSlipSection">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-lg border border-[#0A4B7F]/20 overflow-hidden">
                  <div className="bg-[#0A4B7F] text-white p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                            <span className="font-bold flex items-center gap-2">
                                <ShoppingBasketIcon size={18}/>
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
                        <Trash2Icon size={12}/> Clear All
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
                    {/* Machine/Normal Toggle */}
                    {selectedGame?.allowMachineNumberBet && (
                      <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                        <button
                          type="button"
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${winningType === 1 ? 'bg-white text-[#0A4B7F] shadow' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={(e) => { e.preventDefault(); setWinningType(1); }}
                        >
                          Normal Bet
                        </button>
                        <button
                          type="button"
                          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${winningType === 2 ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow' : 'text-gray-500 hover:text-gray-700'}`}
                          onClick={(e) => { e.preventDefault(); setWinningType(2); }}
                        >
                          Machine Bet
                        </button>
                      </div>
                    )}

                    {accumulatorLegs.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        <p>No bets selected.</p>
                        <p>Click markets to add legs.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {accumulatorLegs.map((leg, i) => (
                          <div key={i}
                               className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
                            <div>
                              <p className="font-medium text-sm text-[#0A4B7F]">{leg.selectionName}</p>
                              <p className="text-xs text-muted-foreground">{leg.betType.code}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="bg-white">{leg.betType.winFactor.toFixed(2)}</Badge>
                              <button onClick={() => toggleLeg(leg.betType)}
                                      className="text-red-400 hover:text-red-600">
                                <Trash2Icon size={14}/>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator/>

                  <div className="p-4 bg-gray-50 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Total Odds:</span>
                      <span className="font-bold text-lg text-[#0A4B7F] tabular-nums">{totalOdds.toFixed(2)}×</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-500">Stake Amount (NGN)</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[50, 100, 200, 500, 1000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setStakeAmount(val)}
                            className={cn(
                              "rounded-lg py-1.5 text-[11px] font-bold border transition-all cursor-pointer tabular-nums",
                              stakeAmount === val
                                ? "bg-[#0A4B7F] text-white border-[#0A4B7F] shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                            )}
                          >
                            ₦{val}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={stakeAmount === 0 ? '' : stakeAmount}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          // Prevent negative values
                          if (value < 0 || Number.isNaN(value)) {
                            setStakeAmount(0)
                          } else {
                            setStakeAmount(value)
                          }
                        }}
                        className={cn(
                          "w-full p-2.5 bg-white border rounded-xl focus:ring-1 outline-none font-bold tabular-nums",
                          (stakeAmount < MIN_STAKE)
                            ? "border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 text-[#0A4B7F] focus:border-[#0A4B7F] focus:ring-[#0A4B7F]"
                        )}
                        min={0}
                      />
                      {(stakeAmount < MIN_STAKE) && (
                        <p className="text-xs text-red-500">
                          Minimum stake is ₦{MIN_STAKE}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center p-3 bg-teal-50 rounded-xl border border-teal-100">
                      <span className="text-sm text-teal-700 font-semibold">Potential Win:</span>
                      <span
                        className={cn("font-bold text-lg tabular-nums", potentialWin > MAX_POTENTIAL_WIN ? "text-red-600" : "text-teal-700")}>
                        {formatCurrency(potentialWin)}
                      </span>
                    </div>

                    {potentialWin > MAX_POTENTIAL_WIN && (
                      <p className="text-center text-xs text-red-500 bg-red-50 p-1 rounded">
                        Maximum potential winning cannot exceed {formatCurrency(MAX_POTENTIAL_WIN)}
                      </p>
                    )}

                    {/* Pay with a free ticket */}
                    <VoucherPicker vouchers={vouchers} selectedId={voucherId} onSelect={chooseVoucher} check={voucherCheck}/>
                    {voucher && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-600">From your wallet:</span>
                        <span className={cn("text-lg font-black", voucherCheck?.ok ? "text-emerald-600" : "text-red-600")}>
                          {voucherCheck?.ok ? '₦0' : accumulatorLegs.length < 2 ? 'Add at least 2 selections' : 'Fix the ticket above'}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full bg-[#0A4B7F] hover:bg-[#093e6b] text-white py-6 text-lg rounded-xl shadow-lg shadow-[#0A4B7F]/20"
                        disabled={
                          accumulatorLegs.length < 2 ||
                          !selectedGame ||
                          loading ||
                          bookingLoading ||
                          stakeAmount < MIN_STAKE ||
                          potentialWin > MAX_POTENTIAL_WIN ||
                          (!!voucher && !voucherCheck?.ok)
                        }
                        onClick={handlePlaceBet}
                      >
                        {loading ? "Processing..." : voucher ? "PLACE BET WITH FREE TICKET" : "PLACE BET"}
                      </Button>
                      <Button
                        className="w-full bg-[#FFF100] hover:bg-[#FFE600] text-[#0A4B7F] py-6 text-lg rounded-xl shadow-lg font-bold"
                        disabled={
                          accumulatorLegs.length < 2 ||
                          !selectedGame ||
                          loading ||
                          bookingLoading ||
                          stakeAmount < MIN_STAKE ||
                          potentialWin > MAX_POTENTIAL_WIN
                        }
                        onClick={handleBookBet}
                      >
                        {bookingLoading ? "Booking..." : "Book A Bet"}
                      </Button>
                    </div>

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
          <BookedTicketDialog ticketId={bookedTicketId} onClose={() => setBookedTicketId(null)} />

          {/* Mobile Sticky Combo Summary Bar */}
          {accumulatorLegs.length > 0 && (
            <div className="fixed bottom-16 left-3 right-3 z-30 lg:hidden">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#0A4B7F] text-white px-4 py-3 shadow-2xl border border-white/20 backdrop-blur-md">
                <div>
                  <p className="text-[11px] text-cyan-200 font-semibold">
                    {accumulatorLegs.length} {accumulatorLegs.length === 1 ? 'Leg' : 'Legs'} · {totalOdds.toFixed(2)}× Odds
                  </p>
                  <p className="text-sm font-black text-[#FFF100] tabular-nums">
                    Win {formatCurrency(potentialWin)}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    document.getElementById("accumulatorSlipSection")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="rounded-full bg-[#FFF100] text-[#0A4B7F] hover:bg-[#ffe84a] text-xs font-black px-4"
                >
                  Review Slip
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="pb-12 sm:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <ContentSections sections={ACCUMULATOR_SECTIONS} />
        </div>
      </section>
    </>
  )
}
