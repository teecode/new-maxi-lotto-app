import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { depositFunds } from '@/services/PaymentService';
import { useState } from 'react';
// import { ConfirmationModal } from './DepositConfirmation';
import type { DepositResponse } from '@/types/api';
import { Spinner } from '@/components/ui/spinner';
import type { User } from '@/types/user';
import { ConfirmationModal } from './deposit-confirmation';
import { useNavigate } from '@tanstack/react-router';

// Config arrays
const paymentMethods = [
  { id: 'cards-paystack', label: 'Paystack Card' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'ussd', label: 'USSD' },
];

// const channels = [
//   {
//     id: 'paystack',
//     name: 'Paystack',
//     logo: '/paystack/Paystack_idIi-h8rZ0_7.png',
//     fallback: 'PS',
//   },
//   {
//     id: 'flutterwave',
//     name: 'Flutterwave',
//     logo: '/flutterwave/Flutterwave_id3uOuItwN_13.png',
//     fallback: 'FW',
//   },
// ];

// Validation schema
const FormSchema = z.object({
  selectedOption: z.string().nonempty({ message: 'You must select a payment method.' }),
  channel: z.string().optional(),
  amount: z.number().min(100, { message: 'Amount must be greater than 100.' }),
});

interface DepositFormProps {
  user: User;
}

export const DepositForm = ({ user }: DepositFormProps) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [depositData, setDepositData] = useState<DepositResponse | null>(null);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedOption: '',
      channel: 'Paystack',
      amount: 0,
    },
  });

  const handleFormReset = () => {
    form.reset(); // You can call it here easily
    // Or you can pass this function down as a prop if you prefer
  };

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      const { amount, selectedOption, channel } = values;

      if (selectedOption === 'transfer') {
        navigate({
          to: '/deposit/sarepay-transfer',
          search: {
            amount
          }
        });
      } else {
        const customerId = user.customerId;
        const response = await depositFunds(customerId, amount, channel);
        if (response) {
          setOpen(true);
          setDepositData(response);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Account validation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:max-w-xl space-y-6"
      >
        {/* Payment Method */}
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-bold text-slate-700">Select Payment Method</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {paymentMethods.map((method) => {
                    const isActive = field.value === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => field.onChange(method.id)}
                        className={cn(
                          "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 group",
                          isActive 
                            ? "bg-pink-50 border-pink-500 shadow-md shadow-pink-500/10 scale-[1.02]" 
                            : "bg-white border-slate-100 hover:border-pink-200 hover:bg-slate-50/50"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl mb-3 flex items-center justify-center transition-colors",
                          isActive ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-400"
                        )}>
                          {/* Placeholder Icon - would be better with real icons per method */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                        </div>
                        <span className={cn(
                          "text-xs font-bold text-center leading-tight transition-colors",
                          isActive ? "text-pink-600" : "text-slate-500 group-hover:text-slate-700"
                        )}>
                          {method.label}
                        </span>
                        
                        {isActive && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-pink-500 rounded-full p-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Channel Select */}
        {/*<FormField*/}
        {/*  control={form.control}*/}
        {/*  name="channel"*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem>*/}
        {/*      <FormLabel>Payment Channel</FormLabel>*/}
        {/*      <Select onValueChange={field.onChange} value={field.value}>*/}
        {/*        <FormControl>*/}
        {/*          <SelectTrigger className="w-full">*/}
        {/*            <SelectValue placeholder="Select a payment channel" />*/}
        {/*          </SelectTrigger>*/}
        {/*        </FormControl>*/}
        {/*        <SelectContent>*/}
        {/*          <SelectGroup>*/}
        {/*            <SelectLabel className="text-xs py-1 font-normal text-muted-foreground ps-2">*/}
        {/*              Available Channels*/}
        {/*            </SelectLabel>*/}
        {/*            {channels.map((channel) => (*/}
        {/*              <SelectItem key={channel.id} value={channel.id}>*/}
        {/*                <span className="flex items-center gap-2">*/}
        {/*                  <Avatar className="size-6">*/}
        {/*                    <AvatarImage src={channel.logo} alt={channel.name} />*/}
        {/*                    <AvatarFallback>{channel.fallback}</AvatarFallback>*/}
        {/*                  </Avatar>*/}
        {/*                  <span>{channel.name}</span>*/}
        {/*                </span>*/}
        {/*              </SelectItem>*/}
        {/*            ))}*/}
        {/*          </SelectGroup>*/}
        {/*        </SelectContent>*/}
        {/*      </Select>*/}
        {/*      <FormMessage />*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}

        {/* Amount Input */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} value={field.value == 0 ? '' : field.value}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF005C] text-white hover:bg-[#e60052]"
        >
          {loading && <Spinner />}
          {loading ? 'Submitting...' : 'Deposit Now'}
        </Button>
        {/* Confirmation Modal */}
        {depositData && (
          <ConfirmationModal open={open} handleFormReset={handleFormReset} setOpen={setOpen} user={user} data={depositData} />
        )}
      </form>
    </Form>
  );
}
