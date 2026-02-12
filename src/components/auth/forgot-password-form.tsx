import { useState } from 'react'
import { forgotPasswordSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Mail } from "lucide-react";
import { requestForgotPassword } from "@/services/AuthService";
import { toast } from "sonner";
import { Link } from '@tanstack/react-router';

const ForgotPasswordForm = () => {

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })
  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {

    const { email } = values;

    try {
      setLoading(true);
      await requestForgotPassword(email)
      // console.log(response);
      toast.success("Password reset link sent to your email")
      form.reset();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // console.log("error", error);
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false);

    }

  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative group">
                  <Input 
                    placeholder="Enter your email" 
                    className="pl-11 h-12 bg-white/[0.08] border-white/[0.12] text-white placeholder:text-slate-500 rounded-xl focus:bg-white/[0.12] focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                    {...field} 
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-400 transition-colors">
                    <Mail size={18} />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs font-medium ml-1" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-base rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
        >
            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin border-white" />}
             {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        {/* Back to Login */}
        <div className="flex justify-center text-sm font-medium gap-1 text-slate-500 pt-2">
          <Link to="/auth/login" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
             Back to Login
          </Link>
        </div>

      </form>
    </Form>
  )
}

export default ForgotPasswordForm