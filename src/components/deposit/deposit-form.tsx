import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
import { SarePayCheckoutModal } from './sarepay-checkout-modal';
import { useNavigate } from '@tanstack/react-router';

// Config arrays
const paymentMethods = [
  { id: 'card', label: 'Card' },
  { id: 'transfer', label: 'Transfer' },
  { id: 'ussd', label: 'USSD' },
  { id: 'sarepay', label: 'SarePay' },
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
  const [sarePayOpen, setSarePayOpen] = useState<boolean>(false);
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

      if (selectedOption === 'sarepay') {
        setSarePayOpen(true);
      } else if (selectedOption === 'transfer') {
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
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex justify-evenly gap-4"
                >
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <FormLabel htmlFor={method.id} className="font-normal">
                        {method.label}
                      </FormLabel>
                    </div>
                  ))}
                </RadioGroup>
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

        {/* SarePay Modal */}
        {sarePayOpen && (
          <SarePayCheckoutModal open={sarePayOpen} setOpen={setSarePayOpen} handleFormReset={handleFormReset} user={user} amount={form.getValues().amount} />
        )}
      </form>
    </Form>
  );
}
