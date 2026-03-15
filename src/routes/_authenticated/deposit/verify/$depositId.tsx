import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import {
  verifyDeposit,
  verifySarepayDeposit,
  verifySarePayTransfer
} from "@/services/PaymentService.ts";

import { Button } from '@/components/ui/button';
import { DownloadIcon, Share2 } from "lucide-react";
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
    const provider = search?.provider;

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50">
      <div className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Success Header Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 sm:p-12 text-center group">
          {/* Decorative burst background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -z-10 group-hover:bg-emerald-500/10 transition-colors duration-700" />
          
          <div className="mb-6 inline-flex p-4 rounded-3xl bg-emerald-50 shadow-inner shadow-emerald-500/10 ring-1 ring-emerald-500/20">
            <div className="bg-emerald-500 text-white rounded-2xl p-3 shadow-lg shadow-emerald-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Success!
          </h1>
          <p className="text-slate-500 font-medium mb-8">
            Your transaction has been processed successfully.
          </p>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100/50 space-y-4">
            <div className="flex justify-between items-baseline border-b border-slate-200/50 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference No.</span>
              <span className="text-sm font-bold font-mono text-slate-700">{response?.reference || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</span>
              <span className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-2 border-slate-100 bg-white text-slate-700 font-bold gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 shadow-sm"
          >
            <DownloadIcon className="w-5 h-5" /> Download
          </Button>
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-2 border-slate-100 bg-white text-slate-700 font-bold gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 shadow-sm"
          >
            <Share2 className="w-5 h-5" /> Share
          </Button>
        </div>

        {/* Navigation Button */}
        <Button 
          size="lg" 
          asChild 
          className="w-full h-16 rounded-[1.25rem] bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-900/20 hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98] transition-all duration-300"
        >
          <Link to="/deposit">
            Go to Deposit
          </Link>
        </Button>

      </div>
    </div>
  )
}

