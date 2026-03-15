import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { User } from "@/types/user"
import { toast } from "sonner"
import { updateUser } from "@/services/UserService"
import { Spinner } from "@/components/ui/spinner"
import { DatePicker } from "@/components/ui/date-picker"

// ✅ Validation schema
const profileSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  middlename: z.string().optional(),
  address: z.string().optional(),
  mobile: z.string().min(6, "Mobile is too short"),
  country: z.string().optional(),
  dateOfBirth: z.date().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettingsForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      middlename: user.middlename ?? "",
      address: user.address ?? "",
      mobile: user.mobile ?? "",
      country: user.country ?? "",
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
    },
  })


  async function onSubmit(values: ProfileFormValues) {
    try {
      setLoading(true)

      const {firstname, lastname, middlename, address, mobile, country, dateOfBirth} = await updateUser({
        ...user,
        ...values,
      } as any)
      toast.success("Profile updated successfully")
        form.reset({
          firstname: firstname ?? "",
          lastname: lastname ?? "",
          middlename: middlename ?? "",
          address: address ?? "",
          mobile: mobile ?? "",
          country: country ?? "",
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        })

    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Subtle Background Decoration for the form area */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 -z-10" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Name Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">First Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="First Name" 
                          className="h-12 rounded-[1.25rem] border-slate-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-300"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middlename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Middle Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Middle Name" 
                          className="h-12 rounded-[1.25rem] border-slate-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-300"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Last Name" 
                          className="h-12 rounded-[1.25rem] border-slate-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-300"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Contact & Location</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Mobile Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Phone Number" 
                          className="h-12 rounded-[1.25rem] border-slate-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-300"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Country</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value="Nigeria" 
                          disabled 
                          className="h-12 rounded-[1.25rem] border-slate-100 bg-slate-50 font-bold text-slate-400 cursor-not-allowed border-dashed"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your residential address" 
                        className="h-12 rounded-[1.25rem] border-slate-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all duration-300"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
                <div className="w-1.5 h-6 bg-pink-500 rounded-full opacity-50" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Security Details</h3>
              </div>

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date of Birth</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? field.value : undefined}
                        onChange={(date) => field.onChange(date)}
                        placeholder="Select your birth date"
                        className="w-full h-12 rounded-[1.25rem] border-slate-200 bg-white/50 focus:bg-white transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="group relative h-16 w-full bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_20px_40px_rgba(15,23,42,0.15)] overflow-hidden" 
            disabled={loading}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? <Spinner className="w-4 h-4" /> : null}
              {loading ? "Synchronizing..." : "Update Secure Profile"}
            </span>
            {/* Animated hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          </Button>
        </form>
      </Form>
    </div>
  )
}
  )
}
