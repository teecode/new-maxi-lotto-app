import { createFileRoute } from '@tanstack/react-router'
import { GuidePage } from '@/components/content/guide-page'
import BonusOffers from '@/components/bonus-offers'
import { PROMOTIONS_GUIDE } from '@/content/promotions'

export const Route = createFileRoute('/_layout/promotions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <GuidePage
      guide={PROMOTIONS_GUIDE}
      id="promotions"
      // The bonuses running now, from the back office; nothing shows when there are none
      top={<BonusOffers embedded heading="Running now" subheading="Free-ticket bonuses you can earn today or soon" />}
    />
  )
}
