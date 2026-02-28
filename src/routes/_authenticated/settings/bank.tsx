import { BankDetailForm } from '@/components/settings/bank-details-form'
import { useFetchBanks, useUserProfile } from '@/hooks/useUserProfile'
import { createFileRoute } from '@tanstack/react-router'
import DataLoader from "@/components/data-loader.tsx"
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/settings/bank')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user, isFetching: isUserFetching } = useUserProfile()
  const { data: banks, isFetching: isBanksFetching } = useFetchBanks()

  return (
    <>
      <PageHeader title="Bank Details"/>

      {/* === bank details form === */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="text-foreground mb-4">
            Your winnings and referral earnings will be credited into this account
          </div>

          {isUserFetching || isBanksFetching || !user || !banks ? (
            <DataLoader />
          ) : (
            <BankDetailForm user={user} banks={banks} />
          )}
        </div>
      </section>
    </>
  )
}