import {createFileRoute, Link} from '@tanstack/react-router'
import {fetchPayoutById} from "@/services/Transactions.ts";

import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import {Image} from "@unpic/react";
import { formatCurrency } from "@/lib/utils.ts";
import { fullDateTimeFormat } from "@/lib/game-time";
import {Button} from "@/components/ui/button.tsx";
import {DownloadIcon, Share2} from "lucide-react";

export const Route = createFileRoute('/_authenticated/payouts/$payoutId')({
  loader: async ({ params }) => {
    const id = Number(params.payoutId)
    const payout = await fetchPayoutById(id)
    if (!payout) {
      throw new Error("Payout not found")
    }

    return payout
  },
  component: RouteComponent,
})

function RouteComponent() {
  const payout = Route.useLoaderData()
  return(
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <>
            <Card className="bg-primary-900" variant="default">
              <CardHeader className="p-6 flex flex-col w-full items-center text-center gap-4">
                {payout.isPaid && (
                  <Image src="/success-icon.png" alt="success-icon" width={50} height={50} />
                )}

                <CardHeading>
                  <CardTitle className="text-background font-semibold text-xl font-poppins">
                    Payout Details
                  </CardTitle>
                  <p className="text-background text-xs font-poppins font-medium">
                    {fullDateTimeFormat(payout.date)}
                  </p>
                </CardHeading>
                <p className="text-3xl font-poppins font-bold text-background">
                  {formatCurrency(payout.amount)}
                </p>
              </CardHeader>
              <CardContent className="text-background space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold">Recipient:</span>
                  <span className="text-foreground-muted">
                    {payout.customerName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Transaction ID:</span>
                  <span className="text-foreground-muted">
                    {payout.details || 'N/A'}
                  </span>
                </div>
                {/* game */}
                <div className="flex justify-between">
                  <span className="font-bold">Bank Name:</span>
                  <span className="text-foreground-muted">
                    {payout.bank || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Account Number:</span>
                  <span className="text-foreground-muted">
                    {payout.accountNumber || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Account Name:</span>
                  <span className="text-foreground-muted">
                    {payout.accountName || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Service Provider:</span>
                  <span className="text-foreground-muted">
                    {payout.serviceName || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Status:</span>
                  <span className="text-foreground-muted">
                    {payout.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>

              </CardContent>
            </Card>

            {/* download and share button */}
            <div className="mt-6 flex justify-between gap-4">
              <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
                <DownloadIcon />
                Download
              </Button>
              <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
                <Share2 /> Share
              </Button>
            </div>

            {/* Go home button */}
            <div className="mt-6">
              <Button size="lg" asChild variant={"destructive"} className="w-full rounded-3xl text-background font-poppins font-semibold">
                <Link to="/payouts">
                  Go to Payouts
                </Link>
              </Button>
            </div>

          </>

        </div>
      </section>
    </>
  )
}
