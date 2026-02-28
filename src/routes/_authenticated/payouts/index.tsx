import { createFileRoute } from '@tanstack/react-router'
import {PayoutsHistory} from "@/components/payouts/payouts-history.tsx";
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/payouts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Payouts"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <PayoutsHistory />
        </div>
      </section>
    </>
  )
}
