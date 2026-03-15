import EmailVerificationAlert from '@/components/user/email-verification'
import ProfileNavigation from '@/components/user/profile-navigation'
import ProfileSettingsMenu from '@/components/user/profile-settings-menu'
import UserInfoCard from '@/components/user/user-info-card'
import {useUserProfile} from '@/hooks/useUserProfile'
import {createFileRoute} from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {

  const {data: user} = useUserProfile()

  return (
    <>
      <PageHeader title="Profile"/>

      <section className="bg-slate-50/50 py-6 sm:py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar: User Info */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {user && (
                <>
                  {!user.isVerified && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                      <EmailVerificationAlert/>
                    </div>
                  )}
                  <UserInfoCard
                    name={user.username}
                    email={user.email}
                    balance={user.walletBalance || 0}
                    avatar={"/avatar.jpg"}
                    rank={user.rank || "Newbie"}
                  />
                </>
              )}
            </div>

            {/* Main Content: Navigation Actions */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Main Menu</h3>
                  <ProfileNavigation/>
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Account Settings</h3>
                  <ProfileSettingsMenu/>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  )
}
