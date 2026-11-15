import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldCheck, Sparkles, Wallet, Zap } from 'lucide-react'
import { useUserProfile } from '@/hooks/useUserProfile.ts'
import { DepositForm } from '@/components/deposit/deposit-form.tsx'
import PageHeader from '@/components/layouts/page-header.tsx'
import { Skeleton } from '@/components/ui/skeleton'
import { PROMO } from '@/content/promotions'
import { formatCurrency } from '@/lib/utils'

export const Route = createFileRoute('/_authenticated/deposit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isLoading } = useUserProfile()
  const [previewAmount, setPreviewAmount] = useState<number>(1000)

  const currentBalance = user?.walletBalance ?? 0
  const validPreview = Number.isFinite(previewAmount) && previewAmount >= 100 ? previewAmount : 0

  return (
    <>
      <PageHeader
        title="Fund Your Wallet"
        subtitle="Instant deposits via Card, Bank Transfer, or USSD"
      />

      <section className="py-8 sm:py-12 bg-slate-50/70 min-h-[70vh]">
        <div className="container mx-auto px-4">
          {isLoading || !user ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <Skeleton className="h-[420px] w-full rounded-3xl bg-slate-200" />
              </div>
              <div className="lg:col-span-5">
                <Skeleton className="h-[320px] w-full rounded-3xl bg-slate-200" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Deposit Form */}
              <div className="lg:col-span-7">
                <DepositForm user={user} onAmountChange={setPreviewAmount} />
              </div>

              {/* Right: Summary & Bonus Info */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
                <div className="rounded-3xl bg-gradient-to-br from-[#0A4B7F] via-[#0185B6] to-[#01B1A8] p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/15">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-100">
                      <Wallet className="w-4 h-4 text-[#FFF100]" /> Wallet Summary
                    </span>
                    <Link
                      to="/transactions"
                      className="text-xs font-bold text-[#FFF100] hover:underline"
                    >
                      History
                    </Link>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">Current Balance</span>
                      <span className="font-bold tabular-nums">{formatCurrency(currentBalance)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/80">Deposit Amount</span>
                      <span className="font-bold text-[#43f7c8] tabular-nums">
                        +{formatCurrency(validPreview)}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white/90">New Balance</span>
                      <span className="text-2xl font-black text-[#FFF100] tabular-nums">
                        {formatCurrency(currentBalance + validPreview)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deposit Bonus Callout */}
                <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-5 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Deposit Bonus Rewards
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Get a <strong>{PROMO.firstDepositBonus}</strong> bonus on your first deposit and{' '}
                    <strong>{PROMO.laterDepositBonus}</strong> on subsequent deposits while the offer runs.{' '}
                    <Link to="/promotions" className="font-bold underline">
                      View terms
                    </Link>
                  </p>
                </div>

                {/* Security Highlights */}
                <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Instant credit to your MaxiLotto wallet once confirmed.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#0185B6] shrink-0 mt-0.5" />
                    <span>Encrypted checkout powered by Paystack and Sarepay.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
