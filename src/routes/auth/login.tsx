import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAuthStore from '@/store/authStore'
import { useState } from 'react'

import { loginSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { login } from '@/services/AuthService'
import {Spinner} from "@/components/ui/spinner.tsx";

const fallback = '/play' as const

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {

  const { setAccessToken, setUser } = useAuthStore((state) => state);

  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {

      setLoading(true)
      const { username, password } = values
      const user = await login(username, password)
      // set Token
      setAccessToken(user.token)
      // set user
      setUser(user)
      // redirect
      await navigate({ to: search.redirect || fallback })
      // show toast
      toast.success("Login successful")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // console.log("error", error);
      toast.error(error?.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
          {/* Logo - Mobile Only (Desktop has it in AuthLayout) */}
          <div className="mb-5 lg:hidden">
            <Image src="/maxilotto.png" alt="Maxi Lotto" width={160} height={50} className="h-9 w-auto object-contain brightness-0 invert" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-400 mt-1.5 font-medium text-center">Sign in to your account</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <Input 
                      placeholder="Username" 
                      className="pl-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                      {...field} 
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-xs font-medium ml-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Password" 
                      className="pl-11 pr-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                      {...field} 
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div onClick={toggleShowPassword}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-white transition-colors">
                      {showPassword ? (
                        <EyeOffIcon size={18} />
                      ) : (
                        <EyeIcon size={18} />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-xs font-medium ml-1" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end px-1">
            <Link to="/auth/forgot-password" className="text-xs font-semibold text-slate-400 hover:text-pink-400 transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
          >
            {loading && <Spinner className="mr-2 h-5 w-5 border-white" />}
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="flex justify-center text-sm font-medium gap-1 text-slate-500 pt-4">
            <span>Don&apos;t have an account?</span>
            <Link to="/auth/signup" className="text-pink-400 hover:text-pink-300 font-bold hover:underline decoration-2 underline-offset-2">
              Create Account
            </Link>
          </div>

        </form>
      </Form>
    </div>
  )
}
