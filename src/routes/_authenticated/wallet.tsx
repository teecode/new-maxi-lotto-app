import BankCard from '@/components/bank-card'
import { EmptyCreditCard } from '@/components/empty-credit-card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useGetCreditCards } from '@/hooks/useCreditCards'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Link } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { EmblaOptionsType } from 'embla-carousel'
import PageHeader from "@/components/layouts/page-header.tsx";
import { useClaimBonus, useMyBonuses, useMyVouchers } from '@/hooks/useBonusPromotions'
import { naira, rewardText, ticketsLeft, timeLeft } from '@/lib/bonus-words'
import { ChevronRight, Gift, LoaderCircle, Ticket } from 'lucide-react'

const OPTIONS: EmblaOptionsType = { slidesToScroll: 2 }

// Free tickets sit beside the balance: what there is to play or claim, a tap from the bonuses page
function FreeTicketsSummary() {
  const { data: vouchers = [] } = useMyVouchers()
  const { data: bonuses = [] } = useMyBonuses()
  const claim = useClaimBonus()
  const claimable = bonuses.filter((b) => b.mine?.status === 'Claimable')
  const worth = vouchers.reduce((sum, v) => sum + v.amount * ticketsLeft(v), 0)
  const soonest = vouchers[0] ? timeLeft(vouchers[0].expirationDate) : null

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
      {claimable.map((bonus) => (
        <div key={bonus.id} className="flex flex-col gap-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow-lg shadow-emerald-600/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20"><Gift className="h-6 w-6" aria-hidden /></span>
            <div>
              <p className="font-bold">{bonus.headline}</p>
              <p className="text-sm text-white/85">{rewardText(bonus)} ready to claim</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => claim.mutate(bonus)}
            disabled={claim.isPending}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 shadow hover:bg-emerald-50 disabled:opacity-60"
          >
            {claim.isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Claim
          </button>
        </div>
      ))}

      <Link
        to="/bonuses"
        className="group flex items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF100] text-[#0A4B7F]"><Ticket className="h-6 w-6" aria-hidden /></span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">Free tickets</p>
            {vouchers.length ? (
              <p className="font-bold text-slate-900">
                {vouchers.length} to play · worth {naira(worth)}
                {soonest && <span className={soonest.urgent ? ' text-red-600' : ' text-slate-500'}> · {soonest.text}</span>}
              </p>
            ) : (
              <p className="font-semibold text-slate-600">Earn free tickets from bonus offers</p>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isFetching: isUserFetching } = useUserProfile()
  const { data: creditCards, isLoading: isCardsLoading } = useGetCreditCards()

  return (
    <>
      <PageHeader title="My Wallet"/>
      <section className="relative py-12 sm:py-20 bg-slate-50/50 min-h-[calc(100vh-200px)] overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-500/5 blur-[120px] rounded-full -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-900/5 blur-[120px] rounded-full -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto space-y-10">
            
            {/* Balance Hero Card */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-8 sm:p-12 text-center shadow-2xl shadow-slate-900/20 animate-in fade-in zoom-in duration-700">
              {/* Subtle pattern or gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              <div className="relative space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Available Balance</span>
                <div className="flex flex-col items-center">
                  {isUserFetching ? (
                    <div className="h-16 flex items-center">
                      <Spinner className="text-white" />
                    </div>
                  ) : (
                    <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter tabular-nums">
                      {formatCurrency(user?.walletBalance || 0)}
                    </h2>
                  )}
                </div>
                
                {/* Visual indicator of stability */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secured Wallet</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <Button
                asChild
                className="h-16 bg-pink-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-pink-500/20 hover:bg-pink-600 hover:shadow-pink-500/30 transition-all duration-300"
              >
                <Link to="/deposit">Deposit Funds</Link>
              </Button>
              <Button
                asChild
                className="h-16 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-slate-200/50 hover:border-slate-900 transition-all duration-300"
              >
                <Link to="/withdrawal">Withdraw</Link>
              </Button>
            </div>

            {/* Free tickets and bonuses to claim */}
            <FreeTicketsSummary/>

            {/* Cards Management Section */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Saved Cards</h3>
                  <p className="text-xs font-medium text-slate-500">Manage your linked debit cards</p>
                </div>
                <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs gap-2 hover:bg-slate-900 hover:text-white transition-all duration-300">
                  <Plus className="h-4 w-4" /> ADD NEW
                </Button>
              </div>

              <div className="p-1 rounded-[2.5rem] bg-gradient-to-b from-slate-200/50 to-transparent">
                <div className="bg-white rounded-[2.4rem] p-6 sm:p-10 shadow-sm border border-slate-100">
                  {isCardsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <Spinner />
                      <p className="text-xs font-bold text-slate-400 animate-pulse">Fetching your cards...</p>
                    </div>
                  ) : !creditCards || creditCards.length === 0 ? (
                    <div className="py-6">
                      <EmptyCreditCard />
                    </div>
                  ) : (
                    <div className="px-4">
                      <BankCard debitCards={creditCards} options={OPTIONS} />
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}