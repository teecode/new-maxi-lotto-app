import ForgotPasswordForm from '@/components/auth/forgot-password-form'
import { createFileRoute } from '@tanstack/react-router'
import { Image } from '@unpic/react'

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
           {/* Logo - Mobile Only (Desktop has it in AuthLayout) */}
           <div className="mb-5 lg:hidden">
             <Image src="/maxilotto.png" alt="Maxi Lotto" width={160} height={50} className="h-9 w-auto object-contain brightness-0 invert" />
           </div>

           <h2 className="text-2xl font-bold text-white tracking-tight text-center">
             Forgot Password?
           </h2>
           <p className="text-sm text-slate-400 mt-1.5 font-medium text-center">
             No worries, we'll send you reset instructions.
           </p>
      </div>

      {/* Form */}
      <ForgotPasswordForm />
    </div>
  )
}
