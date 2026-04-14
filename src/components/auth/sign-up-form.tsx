import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {EyeIcon, EyeOffIcon} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { signupSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { registerUser } from '@/services/AuthService';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';
import {Link, useNavigate} from '@tanstack/react-router';
import { useState, useMemo } from "react";
import {Spinner} from "@/components/ui/spinner.tsx";


const SignUpForm = () => {

  const { setAccessToken, setUser } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  // Read the ?ref= query param from the current URL (set by referral links)
  const referralCode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') ?? undefined;
  }, []);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    try {

      setLoading(true)
      const { username, password, email, phoneNumber } = values
      // Pass the referral code from the URL (if any) to the registration API
      const user = await registerUser(username, email, password, phoneNumber, referralCode)
      // set Token
      setAccessToken(user.token)
      // set user
      setUser(user)

      // show toast
      toast.success("Registration successful")

      // redirect
      await navigate({ to: "/profile" })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      console.log("error", error);
      toast.error(error?.message)

    } finally {
      setLoading(false)
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Changed to "name" instead of "username" */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <Input 
                    placeholder="Username" 
                    className="pl-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    {...field} 
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
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
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <Input 
                    placeholder="Phone Number" 
                    className="pl-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    {...field} 
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs font-medium ml-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <Input 
                    placeholder="Email" 
                    className="pl-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    {...field} 
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs font-medium ml-1" />
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
                    className="pl-11 pr-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    {...field}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div
                    onClick={toggleShowPassword}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs font-medium ml-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="pl-11 pr-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    {...field}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div
                    onClick={toggleShowConfirmPassword}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon size={18} />
                    ) : (
                      <EyeIcon size={18} />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs font-medium ml-1" />
            </FormItem>
          )}
        />

        {/* terms and conditions  */}
        <div className="space-y-4 pt-2">
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="size-5 border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 rounded focus:ring-2 focus:ring-blue-400/20"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <div className="text-xs font-medium text-slate-400">
                    By creating an account you agree to our <Link to={"/terms-and-condition"}
                      className="text-blue-400 hover:underline hover:text-blue-300 font-bold">Terms
                      and Conditions</Link>
                  </div>
                  <FormMessage className="text-red-400 text-xs font-medium" />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ageConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="size-5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded shadow-sm focus:ring-2 focus:ring-blue-500/20"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <div className="text-xs font-medium text-slate-400">
                    I confirm that I am at least 18 years old.
                  </div>
                  <FormMessage className="text-red-500 text-xs font-medium" />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold font-poppins text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 mt-6"
        >
          {loading && <Spinner className="mr-2 h-5 w-5 border-white" />}
          {loading ? 'Creating Account...' : "Sign Up"}
        </Button>



        <div className="flex justify-center text-sm font-medium gap-1 text-slate-500 pt-4">
          <span>Have an account?</span>
          <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline decoration-2 underline-offset-2">
            Sign In
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default SignUpForm