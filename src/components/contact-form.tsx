import { useState } from 'react'
import {
  Field,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Textarea } from '@/components/ui/textarea';
import { sendContactUsMessage } from '@/services/UserService';

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required").refine((email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  }),
  message: z.string().min(1, "Message is required"),
});

const ContactForm = () => {

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    try {
      setIsLoading(true);
      // send messages to backend
      const { name, email, phone, message } = values
      await sendContactUsMessage(name, email, phone, message);
      toast.success("Message sent successfully!");
      form.reset();   // optional

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to request withdrawal.");
    } finally {
      setIsLoading(false);
    }

  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Full name"
                    {...field}
                  />
                </FormControl>
                <FieldError>
                  {form.formState.errors.name?.message}
                </FieldError>
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"

          render={({ field }) => (
            <FormItem>
              <Field>
                <FormControl>
                  <Input id="email" type="email" placeholder="Email address" {...field} />
                </FormControl>
                <FieldError>
                  {form.formState.errors.email?.message}
                </FieldError>
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FormControl>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="Phone number"
                    {...field}
                  />
                </FormControl>
                <FieldError>
                  {form.formState.errors.phone?.message}
                </FieldError>
              </Field>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <Field>
                <FormControl>
                  <Textarea {...field} placeholder="Type your message here." />
                </FormControl>
                <FieldError>
                  {form.formState.errors.message?.message}
                </FieldError>
              </Field>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={isLoading}
          className="relative h-14 w-full bg-slate-900 text-white rounded-[1.25rem] font-black uppercase tracking-widest text-xs transition-all duration-300 hover:bg-slate-800 hover:shadow-[0_10px_30px_rgba(15,23,42,0.15)] disabled:opacity-50 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? <Spinner className="w-4 h-4" /> : null}
            {isLoading ? "Sending Message..." : "Send Message"}
          </span>
          {/* Animated gradient overlay for hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </Button>
      </form>
    </Form>
  )
}

export default ContactForm

