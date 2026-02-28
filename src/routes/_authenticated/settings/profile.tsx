import { ProfileSettingsForm } from '@/components/settings/profile-settings-form'
import { useUserProfile } from '@/hooks/useUserProfile'
import { createFileRoute } from '@tanstack/react-router'
import DataLoader from "@/components/data-loader.tsx"
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isFetching } = useUserProfile()

  return (
    <>
      <PageHeader title="Account Settings"/>

      {/* === profile settings form === */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {isFetching || !user ? (
            <DataLoader />
          ) : (
            <ProfileSettingsForm user={user} />
          )}
        </div>
      </section>
    </>
  )
}