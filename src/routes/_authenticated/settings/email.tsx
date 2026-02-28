import {Button} from '@/components/ui/button';
import {Spinner} from '@/components/ui/spinner';
import {useUserProfile} from '@/hooks/useUserProfile';
import {maskEmail} from '@/lib/utils';
import {sendEmailVerification} from '@/services/AuthService';
import {createFileRoute, redirect, useNavigate} from '@tanstack/react-router'
import {useState} from 'react';
import {toast} from 'sonner';
import PageHeader from "@/components/layouts/page-header.tsx";

export const Route = createFileRoute('/_authenticated/settings/email')({
  beforeLoad: ({context}) => {
    if (context.auth.minimalUser?.isVerified) {
      toast.error('Your email is already verified.');
      throw redirect({to: '/profile'});
    }
  },
  component: RouteComponent,
})

function RouteComponent() {

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {data: user} = useUserProfile()

  const handleVerifyEmail = async () => {
    // Implement email verification logic here
    try {
      setIsLoading(true);

      await sendEmailVerification();

      toast.success('Verification email sent successfully!');

      await navigate({to: '/settings/verify-email'});

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <PageHeader title="Email Verification"/>

      <section className="pb-8 sm:pb-12">
        <div className="container mx-auto px-4">
          <div className="w-full sm:max-w-md px-4 py-6 space-y-6 bg-background rounded-lg shadow-2xl">
            <p className="text-muted-foreground text-center">
              Please verify your email address to continue using our services. We
              will send a verification code to your email address. ({user && maskEmail(user.email)})
            </p>

            {/* request code button */}
            <Button type="button" disabled={isLoading}
                    onClick={handleVerifyEmail}
                    className="w-full mb-4 bg-accent-2-900 text-background text-sm rounded-2xl uppercase hover:opacity-70 hover:bg-primary">
              {isLoading ? <Spinner className="animate-spin size-4"/> : null}
              {isLoading ? 'Requesting...' : 'Request Code'}
            </Button>
          </div>
        </div>

      </section>
    </>
  )
}
