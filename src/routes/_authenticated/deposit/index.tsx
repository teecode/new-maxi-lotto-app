import { createFileRoute } from '@tanstack/react-router'
import {useUserProfile} from "@/hooks/useUserProfile.ts";
import {DepositForm} from "@/components/deposit/deposit-form.tsx";
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/deposit/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: user } = useUserProfile()

  return (
    <>
      <PageHeader title="Deposits"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          {user && <DepositForm user={user} />}
        </div>
      </section>
    </>
  )
}
