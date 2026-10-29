import { createFileRoute } from '@tanstack/react-router'
import { GuidePage } from '@/components/content/guide-page'
import { PermCalculator } from '@/components/content/perm-calculator'
import { TWO_SURE_GUIDE } from '@/content/two-sure'

export const Route = createFileRoute('/_layout/2-sure-lotto')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GuidePage guide={TWO_SURE_GUIDE} id="two-sure" after={{ 'perm-2': <PermCalculator /> }} />
}
