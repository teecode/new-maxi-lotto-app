import { createFileRoute, Link } from '@tanstack/react-router'
import { Gift, LogOut, Play, Ticket } from 'lucide-react'
import EmailVerificationAlert from '@/components/user/email-verification'
import ProfileNavigation from '@/components/user/profile-navigation'
import ProfileSettingsMenu from '@/components/user/profile-settings-menu'
import UserInfoCard from '@/components/user/user-info-card'
import { MiniDepositWidget } from '@/components/deposit/mini-deposit-widget'
import { PushNotificationManager } from '@/components/PushNotificationManager'
import PageHeader from '@/components/layouts/page-header.tsx'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useMyVouchers } from '@/hooks/useBonusPromotions'
import { logout } from '@/services/AuthService'
import useAuthStore from '@/store/authStore'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isLoading } = useUserProfile()
  const { data: vouchers = [] } = useMyVouchers()

  const handleLogout = async () => {
    try {
      await logout()
      useAuthStore.getState().clearToken()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      <PageHeader title="My Profile" subtitle="Manage your wallet, tickets, bonuses, and account settings" />

      <section className="bg-slate-50/60 py-6 sm:py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar: User Info + Mini Deposit */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              {isLoading || !user ? (
                <div className="space-y-4">
                  <Skeleton className="h-[340px] w-full rounded-[2rem] bg-slate-200" />
                  <Skeleton className="h-[240px] w-full rounded-2xl bg-slate-200" />
                </div>
              ) : (
                <>
                  {!user.isVerified && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <EmailVerificationAlert />
                    </div>
                  )}
                  <UserInfoCard
                    name={user.username}
                    email={user.email}
                    balance={user.walletBalance || 0}
                    avatar="/avatar.jpg"
                    rank={user.rank || 'Newbie'}
                    isVerified={user.isVerified}
                  />
                  <MiniDepositWidget user={user} compact />
                  <div>
                    <PushNotificationManager />
                  </div>
                </>
              )}
            </div>

            {/* Main Content: Quick Snapshot + Navigation Actions */}
            <div className="lg:col-span-8 space-y-8">
              {/* Quick Action Snapshot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/play"
                  className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-[#01B1A8] to-[#0185B6] p-4 text-white shadow-md hover:opacity-95 transition-opacity"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                      Ready to win?
                    </p>
                    <p className="text-base font-extrabold">Play 5/90 Lotto</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <Play className="w-5 h-5 fill-white" />
                  </span>
                </Link>

                <Link
                  to="/tickets"
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:border-[#0185B6]/40 transition-colors"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Ticket History
                    </p>
                    <p className="text-base font-extrabold text-[#0A4B7F]">My Bets</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0185B6]/10 text-[#0185B6]">
                    <Ticket className="w-5 h-5" />
                  </span>
                </Link>

                <Link
                  to="/bonuses"
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:border-amber-300 transition-colors"
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Free Tickets
                    </p>
                    <p className="text-base font-extrabold text-[#0A4B7F] tabular-nums">
                      {vouchers.length} Available
                    </p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Gift className="w-5 h-5" />
                  </span>
                </Link>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Wallet &amp; Activity
                  </h3>
                  <ProfileNavigation freeTicketCount={vouchers.length} />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Account Settings
                  </h3>
                  <ProfileSettingsMenu />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold px-6 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
