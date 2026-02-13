import EmailVerificationAlert from '@/components/user/email-verification'
import ProfileNavigation from '@/components/user/profile-navigation'
import ProfileSettingsMenu from '@/components/user/profile-settings-menu'
import UserInfoCard from '@/components/user/user-info-card'
import { useUserProfile } from '@/hooks/useUserProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {

  const { data: user } = useUserProfile()

  return (
    <section className=" bg-background py-4 sm:py-12">
      <div className="container mx-auto space-y-4">
        <div className="flex flex-col py-4 gap-4 shadow-none">
          {user && (
            <>
              {!user.isVerified && (
                <EmailVerificationAlert />
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

        {/* profile settings menu */}
        <div className="p-4 rounded space-y-4 bg-neutral-100">
          <ProfileNavigation />
          <ProfileSettingsMenu />
        </div>
      </div>


    </section>
  )
}
