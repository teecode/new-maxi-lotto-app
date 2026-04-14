import { useUserProfile } from '@/hooks/useUserProfile'
import { createFileRoute } from '@tanstack/react-router'
import DataLoader from "@/components/data-loader.tsx"
import PageHeader from "@/components/layouts/page-header.tsx"
import { ReferralPanel } from '@/components/settings/referral-panel'

export const Route = createFileRoute('/_authenticated/settings/referral')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isFetching, refetch } = useUserProfile()

  return (
    <>
      <PageHeader title="Referral Program" />
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {isFetching || !user ? (
            <DataLoader />
          ) : (
            <ReferralPanel user={user} refetchUser={refetch} />
          )}
        </div>
      </section>
    </>
  )
}
