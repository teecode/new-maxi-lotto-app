import { GameResultHistory } from '@/components/results/game-results-history'
import { createFileRoute } from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_layout/results')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Results"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <GameResultHistory />
        </div>
      </section>
    </>
  )
}
