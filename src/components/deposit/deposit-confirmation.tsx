import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {formatCurrency} from "@/lib/utils"
import type {DepositResponse} from "@/types/api"
import {useState} from "react"
import {toast} from "sonner"
import PaystackPop from "@paystack/inline-js"
import {Spinner} from "@/components/ui/spinner"
import type {User} from "@/types/user"
import {useQueryClient} from "@tanstack/react-query"
import {useNavigate} from "@tanstack/react-router";
// import {redirect} from "@tanstack/react-router";

interface ConfirmationModalProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  data: DepositResponse,
  user: User
  handleFormReset: () => void
}

export function ConfirmationModal({open, setOpen, data, user, handleFormReset}: ConfirmationModalProps) {

  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const depositFunds = async () => {

    try {
      setIsLoading(true)

      // Logging and environment check is best done outside of the production transaction
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_ca2dd4df87ee7d55fafcf8670fdc1479db22ac3d",
        email: user.email,
        amount: data.amount * 100, // Paystack expects amount in kobo
        ref: data.transactionRefrence,
        callback: (response) => {
          // console.log('Payment successful', response);
          // toast.success(`Payment complete! Ref: ${response.reference}`);
          setOpen(false); // Close modal on success
          queryClient.invalidateQueries({queryKey: ['userProfile']})
          // 🎯 IMPORTANT: Call your backend here to verify payment:
          handleFormReset()
          navigate({
            to: "/deposit/verify/$depositId",
            params: {
              depositId: response.reference
            }
          })
        },
        onClose: () => {
          toast.warning('Transaction was not completed, window closed.');
          setOpen(false); // Close modal on close
        },
      });
    } catch (error: any) {
      //console.error("Paystack Initiation Error:", error)
      toast.error(error.message || "Failed to initiate payment gateway.")
    } finally {
      // Paystack pop handles the loading state itself, but we keep this for initial setup delay
      setIsLoading(false)
    }
  }

  return (

    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:mx-auto max-w-[95%] sm:max-w-xl mx-auto bg-background p-4 rounded">

        {/* 🎯 Changed DialogHeader to AlertDialogHeader and AlertDialogTitle */}
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="font-semibold text-lg">Confirm Deposit Details</AlertDialogTitle>
          <AlertDialogDescription>
            Please review the details below before proceeding to the payment gateway.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* 🎯 Moved content structure inside a standard div */}
        <div className="grid gap-4 py-4 text-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="">Amount to pay:</p>
            <span className="font-bold text-lg text-primary-900">{formatCurrency(data.amount)}</span>
          </div>
          <Separator/>
          <div className="flex items-center justify-between gap-2">
            <p className="">Payment Method:</p>
            <span className="font-medium">{data.providerName}</span>
          </div>
          <Separator/>
          <div className="flex items-center justify-between gap-2">
            <p className="">Reference:</p>
            <span className="font-medium text-gray-600">{data.transactionRefrence}</span>
          </div>
        </div>

        {/* 🎯 Use AlertDialogFooter for actions */}
        <AlertDialogFooter className="pt-4 flex flex-row justify-between w-full">
          {/* Cancel Button */}
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
              Cancel
            </Button>
          </AlertDialogCancel>

          {/* Action Button (Pay Now) */}
          <AlertDialogAction asChild>
            <Button
              variant={"primary"}
              disabled={isLoading}
              onClick={depositFunds}
              className="w-full bg-primary-900 text-white flex items-center gap-2 rounded px-6 py-5 uppercase"
            >
              {isLoading && <Spinner/>}
              {isLoading ? "Loading Gateway..." : "Proceed to Pay"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}