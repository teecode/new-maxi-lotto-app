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
  dateOfBirth: z.union([z.date(), z.string()]).optional().transform((val) => val ? new Date(val) : undefined),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettingsForm({ user }: { user: User }) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      middlename: user.middlename ?? "",
      address: user.address ?? "",
      mobile: user.mobile ?? "",
      country: user.country ?? "",
      dateOfBirth: user.dateOfBirth ?? undefined,
    },
  })


  async function onSubmit(values: ProfileFormValues) {
    try {
      setLoading(true)

      const {firstname, lastname, middlename, address, mobile, country, dateOfBirth} = await updateUser(values as User)
      toast.success("Profile updated successfully")
        form.reset({
          firstname: firstname ?? "",
          lastname: lastname ?? "",
          middlename: middlename ?? "",
          address: address ?? "",
          mobile: mobile ?? "",
          country: country ?? "",
          dateOfBirth: dateOfBirth ?? undefined,
        })

    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middlename"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Gender</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(String(val))}
                  defaultValue={String(field.value)}

                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter state"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(String(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                {/* <Input
                  type="date"
                  value={field.value ? field.value.split("T")[0] : ""}
                  onChange={(e) => field.onChange(e.target.value)}
                /> */}
                <DatePicker
                  value={field.value ? field.value : undefined}
                  onChange={(date) => field.onChange(date)}
                  placeholder=""
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary-900 text-background" disabled={loading}>
          {loading && <Spinner />}
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  )
}
