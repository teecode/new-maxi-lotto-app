import {Alert, AlertContent, AlertDescription, AlertIcon} from '@/components/ui/alert'
import {Link} from "@tanstack/react-router";
import {TriangleAlert} from "lucide-react"
import {useUserProfile} from "@/hooks/useUserProfile";

const WithdrawalNotification = () => {
  const { data: user } = useUserProfile();

  if (!user) return null;

  const hasBankDetails = !!(user.accountName && user.accountNumber && user.bank);
  const isVerified = user.isVerified;

  if (hasBankDetails && isVerified) {
    return null;
  }

  return (
    <Alert variant="info" appearance="light">
      <AlertIcon>
        <TriangleAlert />
      </AlertIcon>
      <AlertContent>
        <AlertDescription>
          {!hasBankDetails && (
            <>
              Please complete your bank details <Link className='text-primary font-semibold underline' to="/settings/bank">here</Link>
              {!isVerified && " and "}
            </>
          )}
          {!isVerified && (
            <>
              verify your email <Link to="/profile" className='text-primary font-semibold underline'>here</Link>
            </>
          )}
          {" to enable withdrawals."}
        </AlertDescription>
      </AlertContent>
    </Alert>
  )
}

export default WithdrawalNotification