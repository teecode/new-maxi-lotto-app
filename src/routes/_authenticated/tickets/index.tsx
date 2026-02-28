import { TicketsHistory } from '@/components/tickets/TicketsHistory'
import { createFileRoute } from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/tickets/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Tickets History"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <TicketsHistory />
        </div>
      </section>
    </>
  )
}
