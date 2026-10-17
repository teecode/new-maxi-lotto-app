import { createFileRoute } from '@tanstack/react-router'
import { GuidePage } from '@/components/content/guide-page'
import { LOTTO_GUIDE } from '@/content/lotto-in-nigeria'

export const Route = createFileRoute('/_layout/lotto-in-nigeria')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GuidePage guide={LOTTO_GUIDE} id="lotto-guide" />
}
