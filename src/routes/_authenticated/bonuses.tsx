import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Gift, ShieldCheck, Sparkles, Ticket, Trophy, Wallet } from 'lucide-react'
import PageHeader from '@/components/layouts/page-header.tsx'
import BonusOfferCard from '@/components/bonus/bonus-offer-card'
import VoucherCard from '@/components/bonus/voucher-card'
import { useMyBonuses, useMyVouchers, useVoucherHistory } from '@/hooks/useBonusPromotions'
import { naira, shortDate, ticketsLeft } from '@/lib/bonus-words'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/bonuses')({
  component: RouteComponent,
})

const HOW = [
  { icon: Ticket, title: 'One free ticket, one bet slip', text: 'A free ticket pays the stake of one ticket, up to its value. Your wallet is not charged.' },
  { icon: Trophy, title: 'Wins are yours', text: 'If it wins, the winnings go to your wallet like any other win (up to the cap, where there is one).' },
  { icon: Wallet, title: 'Play it, don\'t withdraw it', text: 'Free tickets cannot be withdrawn or swapped for cash. Any value you do not stake is not kept.' },
  { icon: ShieldCheck, title: 'Use it in time', text: 'Each free ticket has an end date. Play it before then; it is gone after.' },
]

function Section({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#0A4B7F] sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

const Placeholder = ({ className }: { className?: string }) => <div className={cn('animate-pulse rounded-3xl bg-slate-200/70', className)} />

function RouteComponent() {
  const { data: vouchers, isLoading: vouchersLoading } = useMyVouchers()
  const { data: bonuses, isLoading: bonusesLoading } = useMyBonuses()
  const [showHistory, setShowHistory] = useState(false)
  const { data: history } = useVoucherHistory(showHistory)

  const active = new Set((vouchers ?? []).map((v) => String(v.id)))
  const past = (history ?? []).filter((v) => !active.has(String(v.id)))
  const total = (vouchers ?? []).reduce((sum, v) => sum + v.amount * ticketsLeft(v), 0)

  return (
    <>
      <PageHeader title="My bonuses" subtitle="Your free tickets, and the bonuses you can earn" />

      <div className="relative bg-slate-50/60 py-10 sm:py-14">
        <div className="container mx-auto max-w-6xl space-y-12 px-4">
          {/* Free tickets to play */}
          <Section
            title="Free tickets to play"
            subtitle={vouchers?.length ? `${vouchers.length} ready · worth ${naira(total)} in all` : undefined}
          >
            {vouchersLoading ? (
              <div className="grid gap-4 md:grid-cols-2"><Placeholder className="h-40" /><Placeholder className="h-40" /></div>
            ) : vouchers?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {vouchers.map((voucher) => (
                  <VoucherCard key={voucher.id} voucher={voucher} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-10 text-center ring-1 ring-slate-200/70">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF100]/70 text-[#0A4B7F]">
                  <Gift className="h-7 w-7" aria-hidden />
                </span>
                <p className="mt-4 font-bold text-slate-800">No free tickets yet</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">Earn one from a bonus below. When you do, it appears here, ready to play.</p>
              </div>
            )}
          </Section>

          {/* Bonus offers with progress */}
          <Section title="Bonus offers" subtitle="Your progress updates every minute">
            {bonusesLoading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"><Placeholder className="h-96" /><Placeholder className="h-96" /><Placeholder className="hidden h-96 xl:block" /></div>
            ) : bonuses?.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {bonuses.map((bonus) => (
                  <BonusOfferCard key={bonus.id} promo={bonus} signedIn />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-10 text-center ring-1 ring-slate-200/70">
                <Sparkles className="h-7 w-7 text-[#0185B6]" aria-hidden />
                <p className="mt-3 font-bold text-slate-800">No bonuses running right now</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">New offers appear here and on the home page. Check back soon.</p>
                <Link to="/play" className="mt-4 rounded-full bg-[#0A4B7F] px-5 py-2 text-sm font-bold text-white hover:bg-[#0185B6]">Play 5/90</Link>
              </div>
            )}
          </Section>

          {/* How free tickets work */}
          <Section title="How free tickets work">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HOW.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/70">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#01B1A8] to-[#0185B6] text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="mt-3 font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
                </li>
              ))}
            </ul>
          </Section>

          {/* History */}
          <Section
            title="Used and expired"
            action={
              <button type="button" onClick={() => setShowHistory((v) => !v)} aria-expanded={showHistory} className="text-sm font-semibold text-[#0185B6] hover:underline">
                {showHistory ? 'Hide' : 'Show'}
              </button>
            }
          >
            {showHistory && (
              past.length ? (
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70">
                  {past.slice(0, 30).map((v) => {
                    const used = ticketsLeft(v) === 0
                    return (
                      <li key={v.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">{v.displayName || v.name || 'Free ticket'}</p>
                          <p className="text-xs text-slate-500">Earned {shortDate(v.earnedAt)} · {naira(v.amount)}</p>
                        </div>
                        <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-xs font-bold', used ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>
                          {used ? 'Played' : `Expired ${shortDate(v.expirationDate)}`}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="rounded-3xl bg-white px-5 py-6 text-sm text-slate-500 ring-1 ring-slate-200/70">Nothing here yet.</p>
              )
            )}
          </Section>
        </div>
      </div>
    </>
  )
}
