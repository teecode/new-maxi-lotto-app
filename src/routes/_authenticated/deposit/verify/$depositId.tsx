import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import {
  verifyDeposit,
  verifySarepayDeposit,
  verifySarePayTransfer
} from "@/services/PaymentService.ts";

import { Card, CardContent, CardHeader, CardHeading, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, Share2 } from "lucide-react";
import { Image } from "@unpic/react";
import useAuthStore from "@/store/authStore.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const verificationSearchSchema = z.object({
  provider: z.string().optional(),
});

export const Route = createFileRoute(
  '/_authenticated/deposit/verify/$depositId',
)({
  validateSearch: verificationSearchSchema,
  loader: async ({ params, search }: any) => {
    const reference = params.depositId;
    const provider = search.provider;

    try {
      if (provider === 'sarepay') {
        return await verifySarepayDeposit(reference);
      } else if (provider === 'sarepay-transfer') {
        const res = await verifySarePayTransfer(reference);
        const isSuccess = res.status === 'Successful' || res.status === 'COMPLETED' || res.transactionStatus === 'Successful';
        return {
          statusCode: isSuccess,
          reference: reference
        };
      } else {
        const response = await verifyDeposit(reference);
        if (!response) {
          throw new Error("Deposit details not found");
        }
        return response;
      }
    } catch (error) {
      console.error('Verification error:', error);
      throw new Error("Verification failed");
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const response = Route.useLoaderData()

  const { syncUser } = useAuthStore((state) => state)
  const queryClient = useQueryClient()

  // Run side effects ONLY once when response changes
  useEffect(() => {
    const updateUser = async () => {
      if (response?.statusCode) {
        await queryClient.invalidateQueries({ queryKey: ['userProfile'] })
        await syncUser() // wait for it to finish
      }
    }
    void updateUser()
  }, [response?.statusCode])

  return (
    <>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4">

          <Card className="bg-primary-900" variant="default">
            <CardHeader className="p-6 flex flex-col w-full items-center text-center gap-4">
              <Image src="/success-icon.png" alt="success-icon" width={50} height={50}/>
              <CardHeading>
                <CardTitle className="text-background font-semibold text-xl font-poppins">
                  Transaction Success!
                </CardTitle>
              </CardHeading>
            </CardHeader>
            <CardContent className="text-background space-y-2">
            </CardContent>
          </Card>

          {/* download and share buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
              <DownloadIcon /> Download
            </Button>
            <Button variant="dim" className="text-primary-900 px-6 font-medium font-poppins flex gap-2 items-center">
              <Share2 /> Share
            </Button>
          </div>

          {/* Go home button */}
          <div className="mt-6">
            <Button size="lg" asChild variant="destructive"
                    className="w-full rounded-3xl text-background font-poppins font-semibold">
              <Link to="/deposit">
                Go to Deposit
              </Link>

            </Button>
          </div>

        </div>
      </section>
    </>
  )
}

