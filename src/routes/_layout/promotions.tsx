import { createFileRoute } from '@tanstack/react-router'
import { GuidePage } from '@/components/content/guide-page'
import { PROMOTIONS_GUIDE } from '@/content/promotions'

export const Route = createFileRoute('/_layout/promotions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GuidePage guide={PROMOTIONS_GUIDE} id="promotions" />
}
