import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import {
  requestSarePayTransfer,
  verifySarePayTransfer
} from '@/services/PaymentService';
import type { SarePayTransferResponse } from '@/services/PaymentService';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Copy, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/layouts/page-header';

const sarePayTransferSearchSchema = z.object({
  amount: z.number().catch(0),
});

export const Route = createFileRoute('/_authenticated/deposit/sarepay-transfer')({
  validateSearch: sarePayTransferSearchSchema,
  component: SarepayTransferPage,
});

function SarepayTransferPage() {
  const { amount } = Route.useSearch();
  const { data: user } = useUserProfile();
  
  const [isLoading, setIsLoading] = useState(false);
  const [accountDetails, setAccountDetails] = useState<SarePayTransferResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 minutes in seconds
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if amount is 0 or user isn't loaded
  useEffect(() => {
    if ((user && amount <= 0) || !amount) {
      navigate({ to: '/deposit' });
    }
  }, [user, amount, navigate]);

  useEffect(() => {
    if (user && amount > 0 && !accountDetails && !hasError && !isLoading) {
      initiateTransfer();
    }
    return () => stopPolling();
  }, [user, amount]);

  // Countdown timer effect
  useEffect(() => {
    if (!accountDetails || isSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          stopPolling();
          toast.error('Transfer account expired. Please try again.');
          setHasError(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [accountDetails, isSuccess]);

  const initiateTransfer = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await requestSarePayTransfer(user.customerId, amount);
      if (data && data.account_number) {
        setAccountDetails(data);
        startPolling(data.reference);
      } else {
        throw new Error('Could not generate virtual account');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate one-time account.');
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = (ref: string) => {
    stopPolling(); // Clear any existing
    intervalRef.current = setInterval(async () => {
      try {
        const res = await verifySarePayTransfer(ref);
        if (res.status === 'COMPLETED' || res.status === 'Successful' || res.transactionStatus === 'COMPLETED' || res.transactionStatus === 'Successful') {
          handleSuccess(ref);
        }
      } catch (e) {
        // Silently ignore polling errors to not spam user, let it retry
        console.error('Polling error', e);
      }
    }, 10000); // Poll every 10 seconds
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSuccess = (ref: string) => {
    stopPolling();
    setIsSuccess(true);
    toast.success('Transfer received successfully!');
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    
    setTimeout(() => {
      navigate({
        to: '/deposit/verify/$depositId',
        params: {
          depositId: ref,
        },
      });
    }, 2000);
  };

  const copyToClipboard = (text: string, title?: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${title || 'Copied'} to clipboard`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!user || amount <= 0) return null;

  return (
    <>
      <PageHeader title="Bank Transfer Deposit" />
      
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            
            {hasError && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
                <p className="text-lg font-medium">Failed to generate transfer account</p>
                <p className="text-sm text-muted-foreground">Please try again or select a different payment method.</p>
                <Button onClick={() => navigate({ to: '/deposit' })} className="mt-4">
                  Return to Deposits
                </Button>
              </div>
            )}

            {isLoading && !accountDetails && !hasError && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Spinner />
                <p className="text-sm text-muted-foreground">Generating secure virtual account...</p>
              </div>
            )}

            {!isLoading && accountDetails && !isSuccess && !hasError && (
              <div className="space-y-8 mt-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mb-2">Amount to pay</p>
                  <p className="text-4xl font-bold tracking-tight text-primary">{formatCurrency(amount)}</p>
                </div>

                <div className="bg-muted p-5 rounded-xl border space-y-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Bank Name</p>
                      <p className="font-semibold text-lg">{accountDetails.bank}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account Number</p>
                      <p className="font-mono font-bold text-2xl tracking-widest">{accountDetails.account_number}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-10 w-10 shrink-0"
                      onClick={() => copyToClipboard(accountDetails.account_number, 'Account Number')}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Account Name</p>
                      <p className="font-medium text-base">{accountDetails.account_name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Account expires in</p>
                  <p className="text-3xl font-mono font-bold text-orange-600 dark:text-orange-400">
                    {formatTime(timeLeft)}
                  </p>
                </div>

                <div className="text-sm text-center text-muted-foreground px-4">
                  We are waiting for your transfer. This page will close automatically when the payment is confirmed.
                </div>

                <Button variant="outline" onClick={() => navigate({ to: '/deposit' })} className="w-full h-12 text-base">
                  Cancel Transfer
                </Button>
              </div>
            )}

            {isSuccess && (
              <div className="text-center space-y-4 py-12">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <p className="font-bold text-2xl tracking-tight">Deposit Successful!</p>
                <p className="text-base text-muted-foreground px-6">Your transfer was received and your wallet has been credited.</p>
                <div className="pt-8">
                  <Spinner />
                  <p className="text-xs text-muted-foreground mt-4 uppercase tracking-wider">Redirecting you to the receipt</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}
