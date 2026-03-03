import { useState, useRef, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import {
  sarePayCharge,
  sarePaySubmitPin,
  sarePaySubmitOtp,
  verifySarepayDeposit,
} from '@/services/PaymentService';
import { encryptCardData, encryptPin } from '@/utils/sarepay-encryption';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import type { User } from '@/types/user';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';

interface SarePayCheckoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
  amount: number;
  handleFormReset: () => void;
}

type CheckoutState =
  | 'INITIAL' // Entering card details
  | 'PIN'     // Entering PIN
  | 'OTP'     // Entering OTP
  | '3DS'     // Showing 3D Secure Iframe
  | 'SUCCESS';

export function SarePayCheckoutModal({
  open,
  setOpen,
  user,
  amount,
  handleFormReset,
}: SarePayCheckoutModalProps) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>('INITIAL');
  const [isLoading, setIsLoading] = useState(false);
  const [reference, setReference] = useState('');

  // Card Inputs
  const [pan, setPan] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');

  // 2FA Inputs
  const [pin, setPin] = useState('');
  const [otp, setOtp] = useState('');

  // 3DS Output
  const [iframeBodyUrl, setIframeBodyUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Reset state when opened
    if (open) {
      setCheckoutState('INITIAL');
      setReference('');
      setPan('');
      setCvv('');
      setExpiryMonth('');
      setExpiryYear('');
      setPin('');
      setOtp('');
      setIframeBodyUrl('');
    }
  }, [open]);

  // Handle cross-origin messages from the 3DS iframe if applicable
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Very basic example: you would check event.origin and event.data
      console.log('Iframe message received:', event.data);
      // Depending on the event data, you might verify the transaction
      if (checkoutState === '3DS') {
        // You could trigger a verify poll here, but usually, 
        // the webhook or manual verify button does this.
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkoutState]);

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pan || !cvv || !expiryMonth || !expiryYear) {
      toast.error('Please fill all card details.');
      return;
    }

    try {
      setIsLoading(true);
      const encryptedData = encryptCardData(pan, cvv, expiryMonth, expiryYear);
      const response = await sarePayCharge(user.customerId, amount, encryptedData);

      setReference(response.transactionRefrence);

      handleStatusResponse(response.details, response.paymentUrl);
    } catch (error: any) {
      toast.error(error.message || 'SarePay Charge Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      toast.error('Please enter PIN.');
      return;
    }

    try {
      setIsLoading(true);
      const encryptedPin = encryptPin(pin);
      const response = await sarePaySubmitPin(user.customerId, amount, reference, encryptedPin);

      handleStatusResponse(response.details, response.paymentUrl);
    } catch (error: any) {
      toast.error(error.message || 'SarePay PIN Submission Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter OTP.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await sarePaySubmitOtp(user.customerId, amount, reference, otp);

      handleStatusResponse(response.details, response.paymentUrl);
    } catch (error: any) {
      toast.error(error.message || 'SarePay OTP Submission Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerify = async () => {
    try {
      setIsLoading(true);
      const response = await verifySarepayDeposit(reference);
      if (response && response.statusCode) {
        handleSuccess();
      } else {
        toast.error('Transaction is not yet successful or failed.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusResponse = (status: string, urlOptional?: string | null) => {
    switch (status) {
      case 'send_pin':
        setCheckoutState('PIN');
        break;
      case 'send_otp':
        setCheckoutState('OTP');
        break;
      case 'require_auth':
        if (urlOptional) {
          setIframeBodyUrl(urlOptional);
          setCheckoutState('3DS');
        } else {
          toast.error('3D Secure auth required but no URL provided.');
        }
        break;
      case 'approved':
      case 'success':
        handleSuccess();
        break;
      default:
        toast.error(`Unknown payment status received: ${status}`);
        break;
    }
  };

  const handleSuccess = () => {
    setCheckoutState('SUCCESS');
    toast.success('Payment completed successfully!');
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    handleFormReset();
    setTimeout(() => {
      setOpen(false);
      navigate({
        to: '/deposit/verify/$depositId',
        params: {
          depositId: reference,
        },
      });
    }, 1500);
  };

  return (
    <AlertDialog open={open} onOpenChange={(val) => !isLoading && setOpen(val)}>
      <AlertDialogContent className="sm:mx-auto max-w-[95%] sm:max-w-md mx-auto bg-background p-6 rounded">
        <AlertDialogHeader>
          <AlertDialogTitle>SarePay Card Checkout</AlertDialogTitle>
          <AlertDialogDescription>
            {checkoutState === 'SUCCESS'
              ? 'Payment Successful'
              : `Amount: ${formatCurrency(amount)}`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {checkoutState === 'INITIAL' && (
          <form onSubmit={handleChargeSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Card Number (PAN)</label>
              <Input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={pan}
                onChange={(e) => setPan(e.target.value.replace(/\D/g, '').slice(0, 19))}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm font-medium">Month</label>
                <Input
                  type="text"
                  placeholder="MM"
                  value={expiryMonth}
                  onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="text-sm font-medium">Year</label>
                <Input
                  type="text"
                  placeholder="YY"
                  value={expiryYear}
                  onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                  required
                />
              </div>
              <div className="col-span-1">
                <label className="text-sm font-medium">CVV</label>
                <Input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !pan || !cvv || !expiryMonth || !expiryYear}
              className="w-full bg-[#FF005C] hover:bg-[#e60052] text-white"
            >
              {isLoading && <Spinner />} Pay {formatCurrency(amount)}
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)} className="w-full">
              Cancel
            </Button>
          </form>
        )}

        {checkoutState === 'PIN' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Enter Card PIN</label>
              <Input
                type="password"
                placeholder="****"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading || !pin} className="w-full bg-[#FF005C] hover:bg-[#e60052] text-white">
              {isLoading && <Spinner />} Submit PIN
            </Button>
          </form>
        )}

        {checkoutState === 'OTP' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Enter OTP sent to your phone/email</label>
              <Input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading || !otp} className="w-full bg-[#FF005C] hover:bg-[#e60052] text-white">
              {isLoading && <Spinner />} Submit OTP
            </Button>
          </form>
        )}

        {checkoutState === '3DS' && (
          <div className="space-y-4 flex flex-col items-center">
            <p className="text-sm text-center">Please complete the 3D Secure authentication below.</p>
            {/* Some gateways return a full HTML body, others return a URL. 
                If it's an HTML body string, srcDoc is used. If it's a URL, src is used.
                SarePay docs say redirect_auth_data.body contains the string or form. */}
            <div className="w-full border rounded overflow-hidden" style={{ height: '400px' }}>
              <iframe
                ref={iframeRef}
                src={iframeBodyUrl.startsWith('http') ? iframeBodyUrl : undefined}
                srcDoc={!iframeBodyUrl.startsWith('http') ? iframeBodyUrl : undefined}
                title="3D Secure Verify"
                width="100%"
                height="100%"
                frameBorder="0"
                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
              />
            </div>
            <Button
              onClick={handleManualVerify}
              disabled={isLoading}
              className="w-full bg-[#FF005C] hover:bg-[#e60052] text-white mt-4"
            >
              {isLoading && <Spinner />} I have completed authentication
            </Button>
          </div>
        )}

        {checkoutState === 'SUCCESS' && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-lg">Deposit Successful!</p>
            <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
