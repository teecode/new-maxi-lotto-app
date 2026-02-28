import { TransactionsHistory } from '@/components/transactions/transaction-history'
import { createFileRoute } from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/transactions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Transactions"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <TransactionsHistory />
        </div>
      </section>
    </>
  )
}
