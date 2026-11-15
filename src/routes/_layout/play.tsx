import {createFileRoute} from '@tanstack/react-router'
import Ball from "@/components/ball"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {useFetchDailyGames, useGetBetTypes} from "@/hooks/useGames"
import {usePlaceBet} from "@/hooks/usePlaceBet"
import useAuthStore from "@/store/authStore"
import {useBetStore} from "@/store/bet-store.ts"
import type {BetType, Game} from "@/types/game"
import {zodResolver} from "@hookform/resolvers/zod"
import type {EmblaOptionsType} from 'embla-carousel'
import {Trash2Icon, Wallet, PlusCircle, Info} from "lucide-react"
import {useEffect, useMemo, useState} from "react"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"
import {Separator} from "@/components/ui/separator"
import {Skeleton} from "@/components/ui/skeleton"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog"
import {useFetchFavouriteBalls} from "@/hooks/useUserProfile"
import BetSlip from '@/components/play/bet-slip'
import {BookedTicketDialog} from '@/components/play/booked-ticket-dialog'
import {FavouriteBallDialog} from '@/components/play/favourite-ball-dialog'
import GameCarousel from '@/components/play/game-carousel'
import VoucherPicker from '@/components/play/voucher-picker'
import {MiniDepositWidget} from '@/components/deposit/mini-deposit-widget'
import {useRuleNames} from '@/components/bonus/voucher-card'
import {useMyVouchers, useRefreshBonuses} from '@/hooks/useBonusPromotions'
import {checkVoucher, naira, ticketTypeFits} from '@/lib/bonus-words'
import {sortGamesForPlay} from '@/lib/sort-games'
import {isGameClosed} from '@/lib/game-time'
import {cn, formatCurrency} from '@/lib/utils'
import {Gift} from 'lucide-react'

const FormSchema = z.object({
  betType: z.string().min(1, "Please select a bet type"),
})

const OPTIONS: EmblaOptionsType = {loop: true}

export const Route = createFileRoute('/_layout/play')({
  component: RouteComponent,
  // ?voucher=<id>: arrive ready to pay with that free ticket ("Play it now" on a voucher)
  validateSearch: (search: Record<string, unknown>): { voucher?: string } =>
    search.voucher ? {voucher: String(search.voucher)} : {},
})

function RouteComponent() {
  const [selectedBalls, setSelectedBalls] = useState<number[]>([])
  const [againstBalls, setAgainstBalls] = useState<number[]>([])
  const [isMainBall, setIsMainBall] = useState<boolean>(true)
  const [selectedBetType, setSelectedBetType] = useState<BetType | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [depositOpen, setDepositOpen] = useState<boolean>(false)

  const {betsList, selectedGame, addBet, removeBet, clearBets, setSelectedGame} = useBetStore()
  const {isAuthenticated, minimalUser: user, syncUser} = useAuthStore(state => state)

  const {data: betTypes} = useGetBetTypes()
  const {data: games, isLoading: gamesLoading} = useFetchDailyGames()
  const {data: favoriteBalls} = useFetchFavouriteBalls(user)

  const sortedGames = useMemo(() => (games ? sortGamesForPlay(games) : []), [games])

  // Auto-select the soonest open draw if none is chosen yet
  useEffect(() => {
    if (!selectedGame && sortedGames.length > 0) {
      const firstOpen = sortedGames.find((g) => !isGameClosed(g.endDateTime))
      if (firstOpen) setSelectedGame(firstOpen)
    }
  }, [selectedGame, sortedGames, setSelectedGame])

  // Free tickets: the one asked for in the address is chosen once the list arrives
  const search = Route.useSearch()
  // Only free tickets that pay for a 5/90 ticket: accumulator-only ones are played on the Accumulator page
  const {data: myVouchers = []} = useMyVouchers()
  const vouchers = useMemo(() => myVouchers.filter(v => ticketTypeFits(v.ticketType, 1)), [myVouchers])
  const refreshBonuses = useRefreshBonuses()
  const {gameName, betTypeName} = useRuleNames()
  const [voucherId, setVoucherId] = useState<string | null>(null)
  const [voucherFromLink, setVoucherFromLink] = useState(false)
  useEffect(() => {
    if (search.voucher && !voucherFromLink && vouchers.some(v => String(v.id) === search.voucher)) {
      setVoucherId(search.voucher)
      setVoucherFromLink(true)
    }
  }, [search.voucher, vouchers, voucherFromLink])
  // A voucher that has just been used (or expired) drops out of the choice
  useEffect(() => {
    if (voucherId && vouchers.length && !vouchers.some(v => String(v.id) === voucherId)) setVoucherId(null)
  }, [vouchers, voucherId])
  const voucher = vouchers.find(v => String(v.id) === voucherId) ?? null
  const voucherCheck = voucher ? checkVoucher(voucher, betsList, selectedGame, gameName, betTypeName) : null
  const linkedVoucher = search.voucher ? vouchers.find(v => String(v.id) === search.voucher) : undefined

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const betTypeId = form.watch("betType")

  // Update selectedBetType when betTypeId changes
  useEffect(() => {
    if (betTypes && betTypeId) {
      const betType = betTypes.find((betType) => betType.betTypeID === Number(betTypeId))
      setSelectedBetType(betType || null)
    } else {
      setSelectedBetType(null)
    }
  }, [betTypes, betTypeId])

  // Watch for bet type changes and reset (following Vue logic)
  useEffect(() => {
    if (selectedBetType) {
      resetBetSlip()

      // If not AGS, switch to main ball and clear against
      if (selectedBetType.nap !== 'AGS') {
        setAgainstBalls([])
        setIsMainBall(true)
      }
    }
  }, [selectedBetType?.betTypeID])

  // Activate against ball selection (Vue logic)
  const activateAgainstBall = () => {
    if (!selectedBetType) {
      toast.error('Please select bet type first')
      return
    }
    if (selectedBetType.nap !== 'AGS') {
      toast.error('Please select against bet type first')
      return
    }
    setIsMainBall(false)
  }

  // Select ball function (following Vue logic)
  const selectBall = (ball: number) => {
    if (!selectedBetType) {
      toast.error("Please select bet type first")
      return
    }

    if (isMainBall) {
      // Main ball selection
      if (selectedBalls.includes(ball)) {
        setSelectedBalls(selectedBalls.filter(b => b !== ball))
        return
      }

      const ballLength = selectedBalls.length + 1
      if (ballLength > selectedBetType.maximumNumberOfBalls) {
        toast.error(
          `Can only pick ${selectedBetType.maximumNumberOfBalls} ball${
            selectedBetType.maximumNumberOfBalls > 1 ? 's' : ''
          } on selected bet type`
        )
        // Scroll to bet slip when max reached
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
        return
      }

      setSelectedBalls([...selectedBalls, ball])

      // Scroll to bet slip when reaching maximum
      if (ballLength === selectedBetType.maximumNumberOfBalls) {
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
      }
    } else {
      // Against ball selection
      if (againstBalls.includes(ball)) {
        setAgainstBalls(againstBalls.filter(b => b !== ball))
        return
      }

      const ballLength = againstBalls.length + 1
      if (ballLength > selectedBetType.maximumNumberOfBalls) {
        toast.error(
          `Can only pick ${selectedBetType.maximumNumberOfBalls} ball${
            selectedBetType.maximumNumberOfBalls > 1 ? 's' : ''
          } on selected bet type`
        )
        // Scroll to bet slip when max reached
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
        return
      }

      setAgainstBalls([...againstBalls, ball])

      // Scroll to bet slip when reaching maximum
      if (ballLength === selectedBetType.maximumNumberOfBalls) {
        setTimeout(() => {
          document.getElementById("betSlipSection")?.scrollIntoView({behavior: "smooth", block: "center"})
        }, 300)
      }
    }
  }

  // Random ball selection with random count between min and max
  const selectRandomBalls = (pattern: 'random' | 'even' | 'odd') => {
    if (!selectedBetType) {
      toast.error("Please select bet type first")
      return
    }

    const max = selectedBetType.maximumNumberOfBalls
    const min = selectedBetType.minimumNumberOfBalls

    // Randomly decide how many balls to pick (between min and max)
    const randomCount = Math.floor(Math.random() * (max - min + 1)) + min

    // Create pool of available numbers based on pattern
    let availableNumbers: number[] = []

    if (pattern === 'even') {
      // All even numbers from 2 to 90
      availableNumbers = Array.from({length: 45}, (_, i) => (i + 1) * 2)
    } else if (pattern === 'odd') {
      // All odd numbers from 1 to 89
      availableNumbers = Array.from({length: 45}, (_, i) => i * 2 + 1)
    } else {
      // All numbers from 1 to 90
      availableNumbers = Array.from({length: 90}, (_, i) => i + 1)
    }

    // Shuffle and pick random count
    const shuffled = availableNumbers.sort(() => Math.random() - 0.5)
    const selectedNumbers = shuffled.slice(0, randomCount)

    if (isMainBall) {
      setSelectedBalls(selectedNumbers)
    } else {
      setAgainstBalls(selectedNumbers)
    }
  }

  // Quick pick
  const handleQuickPick = () => selectRandomBalls('random')

  // Clear selection
  const clearSelection = () => {
    setSelectedBalls([])
    setAgainstBalls([])
  }

  // Reset bet slip
  const resetBetSlip = () => {
    setSelectedBalls([])
    setAgainstBalls([])
  }

  // Reset all games
  // @ts-ignore
  const resetAllGames = () => {
    resetBetSlip()
    form.setValue("betType", "", {shouldValidate: false})
    setSelectedBetType(null)
    clearBets()
  }

  // Handle place bet
  const {
    handlePlaceBet,
    loading,
    handleBookBet,
    bookingLoading,
    bookedTicketId,
    setBookedTicketId
  } = usePlaceBet({
    user,
    betsList,
    selectedGame: selectedGame,
    resetAllGames: () => {
      clearBets()
    },
    syncUser,
    voucherId: voucher && voucherCheck?.ok ? voucherId : null,
    onVoucherUsed: () => {
      setVoucherId(null)
      refreshBonuses()
    }
  })

  const handleRemoveItem = (index: number) => {
    removeBet(index)
    toast.success("Bet removed successfully!")
  }

  const handleClearCart = () => {
    clearBets()
    toast.success("Cart cleared successfully!")
  }

  const handleSelectedGame = (game: Game) => {
    if (game) {
      setSelectedGame(game)
      form.setValue("betType", "", {shouldValidate: false})
      setSelectedBetType(null)
      setSelectedBalls([])
      setAgainstBalls([])
      clearBets()
      const betTypeSelect = document.getElementById("betTypeSelect")
      betTypeSelect?.scrollIntoView({behavior: "smooth"})
    }
  }

  const handleResetBetSlips = () => {
    form.setValue("betType", "", {shouldValidate: false})
    setSelectedBalls([])
    setAgainstBalls([])
    const betTypeSelect = document.getElementById("betTypeSelect")
    betTypeSelect?.scrollIntoView({behavior: "smooth"})
  }

  // Handle pattern selection (All/Even/Odd) with random count
  const handleSelectPattern = (pattern: "all" | "even" | "odd") => {
    if (!selectedGame) {
      toast.error("Please select a game first")
      return
    }

    if (!selectedBetType) {
      toast.error("Please select bet type first")
      return
    }

    const max = selectedBetType.maximumNumberOfBalls
    const min = selectedBetType.minimumNumberOfBalls

    // Randomly decide how many balls to pick (between min and max)
    const randomCount = Math.floor(Math.random() * (max - min + 1)) + min

    // Create pool of available numbers based on pattern
    let numbers: number[] = []

    if (pattern === "all") {
      numbers = Array.from({length: 90}, (_, i) => i + 1)
    } else if (pattern === "even") {
      numbers = Array.from({length: 45}, (_, i) => (i + 1) * 2)
    } else {
      numbers = Array.from({length: 45}, (_, i) => i * 2 + 1)
    }

    // Shuffle and pick random count
    const shuffled = numbers.sort(() => Math.random() - 0.5)
    const limited = shuffled.slice(0, randomCount)

    if (isMainBall) {
      setSelectedBalls(limited)
    } else {
      setAgainstBalls(limited)
    }
  }

  return (
    <>
      <section className="pt-24 sm:pt-28 pb-20 sm:pb-16 min-h-screen bg-gradient-to-b from-[#01B1A8] to-[#0185B6]">
        <div className="container mx-auto px-4">
          {/* Arrived from "Play it now" on a free ticket */}
          {linkedVoucher && betsList.length === 0 && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-white/50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF100] text-[#0A4B7F]">
                <Gift className="h-5 w-5" aria-hidden/>
              </span>
              <div className="text-sm">
                <p className="font-bold text-[#0A4B7F]">Your {naira(linkedVoucher.amount)} free ticket is ready</p>
                <p className="text-slate-600">
                  Pick a game, choose your numbers and add the bet with a stake of up to {naira(linkedVoucher.amount)}.
                  It is paid with your free ticket in My Games, not from your wallet.
                </p>
              </div>
            </div>
          )}
          {/* Game Carousel */}
          {gamesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {Array.from({length: 3}).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/20" />
              ))}
            </div>
          ) : sortedGames.length > 0 ? (
            <GameCarousel
              handleSelectedGame={handleSelectedGame}
              games={sortedGames}
              options={OPTIONS}
            />
          ) : null}
          <Separator className="my-4 opacity-30"/>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {
            })}>
              {/* Header + Wallet + Bet Type Selector */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-8 bg-[#FFF100] rounded-full"></span>
                    Play 5/90
                  </h1>
                  {isAuthenticated && user && (
                    <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        <Wallet className="w-3.5 h-3.5 text-[#FFF100]" />
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

                <FormField
                  control={form.control}
                  name="betType"
                  render={({field}) => (
                    <FormItem id="betTypeSelect" className="w-full sm:w-auto flex-shrink-0">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedGame}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full sm:min-w-[280px] bg-white border-2 border-white rounded-xl px-4 md:px-6 py-4 md:py-5 text-[#0A4B7F] font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all">
                            <SelectValue placeholder={selectedGame ? "🎯 Select Bet Type" : "🎮 Select Game First"}/>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white rounded-xl border-2 border-gray-100 max-h-80">
                          {betTypes?.map((betType) => (
                            <SelectItem
                              key={betType.betTypeID}
                              value={String(betType.betTypeID)}
                              className="font-bold text-sm text-[#0A4B7F] hover:bg-[#0185B6]/10 cursor-pointer py-2.5"
                            >
                              <div className="flex items-center justify-between gap-4 w-full">
                                <span>{betType.code}</span>
                                <span className="text-xs font-semibold text-teal-600 tabular-nums">
                                  {betType.winFactor}×
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>

              {/* Popular Bet Type Quick Chips + Selected Bet Rule Banner */}
              {betTypes && betTypes.length > 0 && selectedGame && (
                <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider mr-1">
                      Popular:
                    </span>
                    {betTypes
                      .filter((bt) =>
                        ["2 DIRECT", "PERM 2", "3 DIRECT", "BANKER", "1 DIRECT"].some(
                          (code) => bt.code.toUpperCase().includes(code),
                        ),
                      )
                      .slice(0, 5)
                      .map((bt) => {
                        const active = selectedBetType?.betTypeID === bt.betTypeID
                        return (
                          <button
                            key={bt.betTypeID}
                            type="button"
                            onClick={() => form.setValue("betType", String(bt.betTypeID), { shouldValidate: true })}
                            className={cn(
                              "rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border",
                              active
                                ? "bg-[#FFF100] text-[#0A4B7F] border-[#FFF100] shadow-md"
                                : "bg-white/15 text-white border-white/25 hover:bg-white/25",
                            )}
                          >
                            {bt.code} <span className="opacity-75">({bt.winFactor}×)</span>
                          </button>
                        )
                      })}
                  </div>

                  {selectedBetType && (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-black/20 border border-white/15 px-3.5 py-2 text-xs text-white/95 backdrop-blur-sm">
                      <Info className="w-3.5 h-3.5 text-[#FFF100] shrink-0" />
                      <span>
                        <strong>{selectedBetType.napDescription || selectedBetType.code}:</strong>{" "}
                        Pick{" "}
                        {selectedBetType.minimumNumberOfBalls === selectedBetType.maximumNumberOfBalls
                          ? `${selectedBetType.minimumNumberOfBalls}`
                          : `${selectedBetType.minimumNumberOfBalls}–${selectedBetType.maximumNumberOfBalls}`}{" "}
                        ball{selectedBetType.maximumNumberOfBalls > 1 ? "s" : ""} · Pays{" "}
                        <strong className="text-[#FFF100]">{selectedBetType.winFactor}×</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Main/Against Ball Toggle - Only show for AGS */}
              {selectedBetType?.nap === 'AGS' && (
                <div className="flex gap-4 mb-6 justify-center">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMainBall(true)
                    }}
                    size="sm"
                    className={`h-9 px-6 text-sm font-bold rounded-4xl ${
                      isMainBall
                        ? "bg-white text-[#0A4B7F] border-2 border-white"
                        : "bg-[#0A4B7F] text-white border-2 border-white"
                    }`}
                  >
                    Select Main Ball
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      activateAgainstBall()
                    }}
                    size="sm"
                    className={`h-9 px-6 text-sm font-bold rounded-4xl ${
                      !isMainBall
                        ? "bg-white text-[#0A4B7F] border-2 border-white"
                        : "bg-[#0A4B7F] text-white border-2 border-white"
                    }`}
                  >
                    Select Against Ball
                  </Button>
                </div>
              )}

              {/* Actions - Modern Design */}
              <div className="flex justify-between flex-wrap gap-4 items-center mb-6">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => handleSelectPattern("all")}
                    size="sm"
                    type="button"
                    className="h-9 px-5 text-sm font-bold bg-white text-[#0185B6] hover:bg-white/90 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <span className="mr-1.5">🎲</span> All
                  </Button>
                  <Button
                    onClick={() => handleSelectPattern("even")}
                    size="sm"
                    type="button"
                    className="h-9 px-5 text-sm font-bold bg-gradient-to-r from-[#FFF100] to-[#FFD700] text-[#0A4B7F] hover:opacity-90 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <span className="mr-1.5">2️⃣</span> Even
                  </Button>
                  <Button
                    onClick={() => handleSelectPattern("odd")}
                    size="sm"
                    type="button"
                    className="h-9 px-5 text-sm font-bold bg-gradient-to-r from-[#01B1A8] to-[#0185B6] text-white hover:opacity-90 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <span className="mr-1.5">1️⃣</span> Odd
                  </Button>

                  {favoriteBalls && favoriteBalls.length > 0 && (
                    <Button
                      size="sm"
                      type="button"
                      className="h-9 px-5 text-sm font-bold bg-pink-500 text-white hover:bg-pink-600 rounded-xl shadow-md transition-all hover:scale-105"
                      onClick={() => setOpenDialog(true)}
                    >
                      <span className="mr-1.5">⭐</span> Favorites
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    type="button"
                    className="h-9 px-5 text-sm font-bold bg-white text-[#0A4B7F] hover:bg-white/90 rounded-xl shadow-md transition-all hover:scale-105"
                    onClick={handleQuickPick}
                  >
                    <span className="mr-1.5">⚡</span> Quick Pick
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    onClick={clearSelection}
                    className="h-9 w-9 bg-red-500 text-white hover:bg-red-600 rounded-xl shadow-md transition-all hover:scale-105"
                  >
                    <Trash2Icon size={16}/>
                  </Button>
                </div>
              </div>

              {/* Desktop: 8/4 Grid (Sticky Slip), Mobile: Stacked */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Ball Grid */}
                <div className="lg:col-span-8">
                  {/* Selection Counter */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3 mx-auto w-fit">
                  <span className="text-white font-bold flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 bg-[#FFF100] rounded-full animate-pulse"></span>
                    {selectedBalls.length} {selectedBalls.length === 1 ? 'Ball' : 'Balls'} Selected
                  </span>
                  </div>

                  {/* Ball Grid - Snooker Ball Style */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-4 md:p-6 border-4 border-white/50">
                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 md:gap-3">
                      {Array.from({length: 90}, (_, i) => i + 1).map((num) => {
                        const isSelected = isMainBall
                          ? selectedBalls.includes(num)
                          : againstBalls.includes(num)

                        return (
                          <Ball
                            key={num}
                            value={num}
                            isSelected={isSelected}
                            className={
                              isSelected
                                ? (isMainBall
                                  ? 'bg-gradient-to-br from-[#0185B6] to-[#0066A1] text-white shadow-2xl scale-110 border-4 border-white'
                                  : 'bg-gradient-to-br from-red-600 to-red-800 text-white shadow-2xl scale-110 border-4 border-white')
                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gradient-to-br hover:from-[#0185B6]/10 hover:to-[#01B1A8]/10 hover:scale-105 hover:shadow-md hover:border-[#0185B6]'
                            }
                            onClick={() => selectBall(num)}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Sticky Bet Slip + My Games */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6" id="betSlipSection">
                  {/* Bet Slip */}
                  <BetSlip
                    selectedBetType={selectedBetType!}
                    setSelectedBetType={setSelectedBetType}
                    selectedBalls={selectedBalls}
                    bankerBalls={selectedBetType?.code === 'BANKER' ? selectedBalls : []}
                    againstBalls={againstBalls}
                    selectionMode={isMainBall ? "normal" : "against"}
                    collisionCount={0}
                    addBet={addBet}
                    setSelectedBalls={setSelectedBalls}
                    betLists={betsList}
                    selectedGame={selectedGame}
                    handleResetBetSlips={handleResetBetSlips}
                    setAgainstBalls={setAgainstBalls}
                    setBankerBalls={() => {}}
                    isMainBall={isMainBall}
                  />


                  {/* My Games - Inside right column on desktop, below betslip on mobile */}
                  {betsList.length > 0 && (
                    <div id="gamesListSection" className="bg-white rounded-2xl shadow-lg w-full overflow-hidden border border-gray-100">

                      {/* Modern Header with Gradient */}
                      <div className="relative bg-gradient-to-r from-[#01B1A8] to-[#0185B6] px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#FFF100] rounded-full animate-pulse"></div>
                            <h3 className="text-white font-bold text-lg tracking-wide">My Games ({betsList.length})</h3>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearCart}
                            className="text-white hover:bg-white/20 h-7 text-xs font-semibold"
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Games List */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                          {betsList.map((bet, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-3 hover:border-[#0185B6]/30 hover:shadow-md transition-all"
                            >
                              {/* Header */}
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="text-sm font-bold text-[#0A4B7F] mb-1">
                                    {selectedGame?.gameName}
                                  </div>
                                  <div className="inline-block bg-[#0185B6] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                    {bet.betType.code}
                                  </div>
                                  {bet.winningType === 2 && (
                                    <div className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                                      Machine Bet
                                    </div>
                                  )}
                                  {bet.winningType === 3 && (
                                    <div className="inline-block bg-gradient-to-r from-[#0185B6] to-[#01B1A8] text-white px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                                      Double Chance
                                    </div>
                                  )}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-red-500 hover:bg-red-50 h-7 w-7 -mt-1 -mr-1"
                                >
                                  <Trash2Icon size={16}/>
                                </Button>
                              </div>

                              {/* Numbers Display - Badge Style */}
                              <div className="mb-3">
                                {bet.betType.code === 'BANKER' ? (
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1.5">
                                      {bet.selectedBalls.map((ball, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-[#0185B6] text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                                        >
                                        {ball}
                                      </span>
                                      ))}
                                      <span className="bg-[#FFF100] text-[#0A4B7F] px-2.5 py-1 rounded-full text-xs font-bold">
                                      AG 1-90
                                    </span>
                                    </div>
                                  </div>
                                ) : bet.betType.nap === 'AGS' ? (
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap gap-1.5">
                                      {bet.selectedBalls.map((ball, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-[#0185B6] text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                                        >
                                        {ball}
                                      </span>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs text-gray-600 font-semibold">AG</span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {bet.againstBalls.map((ball, idx) => (
                                          <span
                                            key={idx}
                                            className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                                          >
                                          {ball}
                                        </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5">
                                    {bet.selectedBalls.map((ball, idx) => (
                                      <span
                                        key={idx}
                                        className="bg-[#0185B6] text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm"
                                      >
                                      {ball}
                                    </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Calculation Summary */}
                              <div className="bg-white border border-gray-200 rounded-lg p-2 space-y-1.5 text-xs">
                                <div className="flex justify-between items-center font-semibold text-gray-700">
                                  <span>{bet.numberOfLines} × ₦{bet.amount}</span>
                                  <span className="text-[#0A4B7F]">= ₦{bet.stake.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                                  <span className="text-teal-700 font-bold">Win:</span>
                                  <span className="text-teal-600 font-bold">₦{bet.maxWinning.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pay with a free ticket */}
                        <VoucherPicker vouchers={vouchers} selectedId={voucherId} onSelect={setVoucherId} check={voucherCheck}/>

                        {/* Total and Place Bet */}
                        <div className="mt-4 pt-4 border-t-2 border-gray-200">
                          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">Total Stake:</span>
                              <span className={`text-2xl font-bold ${voucher ? 'text-gray-400 line-through decoration-2' : 'text-[#0A4B7F]'}`}>
                              ₦{betsList.reduce((sum, bet) => sum + bet.stake, 0).toLocaleString()}
                            </span>
                            </div>
                            {voucher && (
                              <div className="mt-1 flex justify-between items-center text-sm">
                                <span className="font-semibold text-gray-600">From your wallet:</span>
                                <span className={`text-xl font-black ${voucherCheck?.ok ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {voucherCheck?.ok ? '₦0' : 'Fix the ticket above'}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              onClick={handlePlaceBet}
                              disabled={loading || bookingLoading || (!!voucher && !voucherCheck?.ok)}
                              className="w-full bg-gradient-to-r from-[#0185B6] to-[#01B1A8] text-[#FFF100] rounded-xl py-5 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
                            >
                              {loading ? 'Placing Bet...' : voucher ? 'Place Bet with Free Ticket' : 'Place Bet'}
                            </Button>
                            <Button
                              type="button"
                              onClick={handleBookBet}
                              disabled={loading || bookingLoading}
                              className="w-full bg-[#FFF100] text-[#0A4B7F] hover:bg-[#FFE600] rounded-xl py-5 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50"
                            >
                              {bookingLoading ? 'Booking...' : 'Book A Bet'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>


          {favoriteBalls && (
            <FavouriteBallDialog
              open={openDialog}
              setOpen={setOpenDialog}
              favoriteBalls={favoriteBalls}
              selectBall={selectBall}
              bankerBalls={selectedBetType?.code === 'BANKER' ? selectedBalls : []}
              againstBalls={againstBalls}
              normalBalls={selectedBalls}
            />
          )}

          <BookedTicketDialog ticketId={bookedTicketId} onClose={() => setBookedTicketId(null)} />

          {/* Mobile Sticky Checkout Bar */}
          {betsList.length > 0 && (
            <div className="fixed bottom-16 left-3 right-3 z-30 lg:hidden">
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#0A4B7F] text-white px-4 py-3 shadow-2xl border border-white/20 backdrop-blur-md">
                <div>
                  <p className="text-[11px] text-cyan-200 font-semibold">
                    {betsList.length} {betsList.length === 1 ? 'Bet' : 'Bets'} in Slip
                  </p>
                  <p className="text-base font-black text-[#FFF100] tabular-nums">
                    ₦{betsList.reduce((sum, bet) => sum + bet.stake, 0).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("gamesListSection")?.scrollIntoView({ behavior: "smooth", block: "center" })
                    }
                    className="rounded-full border-white/30 bg-white/10 text-white text-xs font-bold"
                  >
                    Review
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handlePlaceBet}
                    disabled={loading || bookingLoading || (!!voucher && !voucherCheck?.ok)}
                    className="rounded-full bg-[#FFF100] text-[#0A4B7F] hover:bg-[#ffe84a] text-xs font-black px-4"
                  >
                    {loading ? 'Placing...' : 'Place Bet'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>

  )
}