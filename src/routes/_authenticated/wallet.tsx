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

const OPTIONS: EmblaOptionsType = { slidesToScroll: 2 }

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