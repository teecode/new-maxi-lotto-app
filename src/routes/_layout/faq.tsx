import FaqData from '@/components/faq-data'
import { createFileRoute } from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/faq')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Faq" className="uppercase"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <FaqData />
        </div>
      </section>
    </>
  )
}
