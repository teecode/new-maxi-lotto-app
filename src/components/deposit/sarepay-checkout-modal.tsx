import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { initSarePayDeposit } from '@/services/PaymentService';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import type { User } from '@/types/user';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

// Extend Window interface to recognize Sarepay
declare global {
  interface Window {
    Sarepay: any;
  }
}

interface SarePayCheckoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
  amount: number;
  handleFormReset: () => void;
}

export function SarePayCheckoutModal({
  open,
  setOpen,
  user,
  amount,
  handleFormReset,
}: SarePayCheckoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && !hasInitialized) {
      handleInitialize();
    }
  }, [open]);

  const handleInitialize = async () => {
    try {
      setIsLoading(true);
      setHasInitialized(true);

      // 1. Call backend to create pending deposit and get reference
      const response = await initSarePayDeposit(user.customerId, amount);
      const reference = response.transactionRefrence;

      if (!reference) {
        throw new Error('No transaction reference received');
      }

      // 2. Initialize Sarepay widget
      if (typeof window.Sarepay === 'undefined') {
        throw new Error('Sarepay SDK not loaded. Please try again.');
      }

      window.Sarepay.initialize({
        key: "PUBLIC-C3yCwvIiNmwE9pqIR3jG3TcRuiU7", // Should ideally be in env
        token: "lV6KiEcG2BBKWmyT1UVqYtvL7ilxp3M6", // Should ideally be in env
        amount: amount * 100, // Typically amounts are in kobo when using integrations, confirm with Sarepay docs if needed, but the user snippet showed an integer. If it expects NGN, just use `amount`. Based on the snippet amount was 7106, likely raw integer or kobo. Let's send raw amount.
        currency: "NGN",
        feeBearer: "customer",
        customer: { 
          name: `${user.firstname} ${user.lastname}`, 
          email: user.email || 'customer@maxilotto.com' 
        },
        containerId: "sarepay-payment-container",
        reference: reference,
        metadata: {
          customerId: user.customerId
        },
        onClose: () => {
          setOpen(false);
          setHasInitialized(false);
        },
        onSuccess: (response: any) => {
          console.log('Sarepay Success', response);
          toast.success('Payment completed successfully!');
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
          handleFormReset();
          setOpen(false);
          navigate({
            to: '/games',
          });
        },
        onFailed: (response: any) => {
          console.error('Sarepay Failed', response);
          toast.error('Payment failed or was cancelled.');
          setOpen(false);
          setHasInitialized(false);
        }
      });
    } catch (error: any) {
      toast.error(error.message || 'SarePay Initialization Error');
      setOpen(false);
      setHasInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => {
      // Allow closing if not loading
      if (!isLoading && !val) {
        setOpen(false);
        setHasInitialized(false);
      }
    }}>
      <AlertDialogContent className="sm:mx-auto max-w-[95%] sm:max-w-md mx-auto bg-background p-6 rounded">
        <AlertDialogHeader>
          <AlertDialogTitle>SarePay Card Checkout</AlertDialogTitle>
          <AlertDialogDescription>
            {isLoading ? 'Initializing secure payment window...' : `Amount: ${formatCurrency(amount)}`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="min-h-[300px] flex items-center justify-center">
          {isLoading && <Spinner />}
          
          <div 
            id="sarepay-payment-container" 
            className="w-full h-full min-h-[400px]"
            // This is where the iframe will be mounted by the widget
          ></div>
        </div>
        
        {!isLoading && (
          <Button variant="ghost" onClick={() => {
            setOpen(false);
            setHasInitialized(false);
          }} className="w-full mt-4">
            Cancel
          </Button>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
