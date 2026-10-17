import { GameResultHistory } from '@/components/results/game-results-history'
import { createFileRoute } from '@tanstack/react-router'
import PageHeader from "@/components/layouts/page-header.tsx";
import { ContentSections } from '@/components/content/content-sections'
import { RESULTS_SECTIONS } from '@/content/results'

export const Route = createFileRoute('/_layout/results')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader title="Lotto Results" subtitle="MaxiLotto 5/90 winning and machine numbers for every draw"/>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <GameResultHistory />
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <ContentSections sections={RESULTS_SECTIONS} />
        </div>
      </section>
    </>
  )
}
