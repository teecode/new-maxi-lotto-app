import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { Building2, Check, CreditCard, Lock, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn, formatCurrency } from '@/lib/utils';
import { depositFunds } from '@/services/PaymentService';
import type { DepositResponse } from '@/types/api';
import type { User } from '@/types/user';
import { ConfirmationModal } from './deposit-confirmation';

const paymentMethods = [
  {
    id: 'cards-paystack',
    label: 'Paystack Card',
    subtitle: 'Instant debit card',
    icon: CreditCard,
  },
  {
    id: 'transfer',
    label: 'Bank Transfer',
    subtitle: 'Sarepay virtual acct',
    icon: Building2,
  },
  {
    id: 'ussd',
    label: 'USSD',
    subtitle: 'Dial bank *code#',
    icon: Smartphone,
  },
] as const;

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const FormSchema = z.object({
  selectedOption: z.string().min(1, { message: 'Please select a payment method.' }),
  channel: z.string().optional(),
  amount: z
    .number({ error: 'Please enter a valid deposit amount.' })
    .min(100, { message: 'Minimum deposit is ₦100.' }),
});

interface DepositFormProps {
  user: User;
  onAmountChange?: (amount: number) => void;
}

export const DepositForm = ({ user, onAmountChange }: DepositFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [depositData, setDepositData] = useState<DepositResponse | null>(null);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      selectedOption: 'cards-paystack',
      channel: 'Paystack',
      amount: 1000,
    },
  });

  const watchedAmount = form.watch('amount');

  const handleAmountUpdate = (val: number) => {
    const safeVal = Number.isNaN(val) ? 0 : Math.max(0, val);
    form.setValue('amount', safeVal, { shouldValidate: true });
    onAmountChange?.(safeVal);
  };

  const handleFormReset = () => {
    form.reset({
      selectedOption: 'cards-paystack',
      channel: 'Paystack',
      amount: 1000,
    });
    onAmountChange?.(1000);
  };

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      const { amount, selectedOption, channel } = values;

      if (selectedOption === 'transfer') {
        await navigate({
          to: '/deposit/sarepay-transfer',
          search: {
            amount,
          },
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
      toast.error(error.message || 'Account validation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm"
      >
        {/* Payment Method */}
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base font-extrabold text-[#0A4B7F]">
                1. Choose Payment Method
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => {
                    const isActive = field.value === method.id;
                    const Icon = method.icon;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => field.onChange(method.id)}
                        className={cn(
                          'relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 group text-center',
                          isActive
                            ? 'bg-pink-50/70 border-[#FF005C] shadow-md shadow-pink-500/10'
                            : 'bg-white border-slate-200 hover:border-pink-200 hover:bg-slate-50/60',
                        )}
                      >
                        <div
                          className={cn(
                            'w-11 h-11 rounded-xl mb-2.5 flex items-center justify-center transition-colors',
                            isActive
                              ? 'bg-[#FF005C] text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-pink-100 group-hover:text-[#FF005C]',
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={cn(
                            'text-xs sm:text-sm font-bold leading-tight',
                            isActive ? 'text-[#FF005C]' : 'text-slate-800',
                          )}
                        >
                          {method.label}
                        </span>
                        <span className="mt-0.5 text-[11px] text-slate-500">
                          {method.subtitle}
                        </span>

                        {isActive && (
                          <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF005C] text-white">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount Input + Quick Chips */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-extrabold text-[#0A4B7F]">
                  2. Enter Amount (NGN)
                </FormLabel>
                <span className="text-xs text-slate-500 font-medium">Min: ₦100</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {QUICK_AMOUNTS.map((val) => {
                  const active = watchedAmount === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountUpdate(val)}
                      className={cn(
                        'rounded-xl py-2 text-xs font-bold border transition-all cursor-pointer tabular-nums',
                        active
                          ? 'bg-[#0A4B7F] text-white border-[#0A4B7F] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100',
                      )}
                    >
                      ₦{val.toLocaleString()}
                    </button>
                  );
                })}
              </div>

              <FormControl>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-extrabold text-slate-400">
                    ₦
                  </span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={100}
                    placeholder="Enter deposit amount"
                    value={Number.isFinite(field.value) && field.value > 0 ? field.value : ''}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      const safeVal = Number.isNaN(val) ? 0 : Math.max(0, val);
                      field.onChange(safeVal);
                      onAmountChange?.(safeVal);
                    }}
                    className="pl-9 h-12 rounded-xl border-2 border-slate-200 focus:border-[#0185B6] text-lg font-extrabold text-[#0A4B7F] tabular-nums"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full h-12 rounded-full bg-[#FF005C] text-white hover:bg-[#e60052] font-extrabold text-sm sm:text-base shadow-lg shadow-rose-500/20 cursor-pointer"
        >
          {loading ? (
            <>
              <Spinner className="mr-2" /> Starting deposit...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Deposit {Number.isFinite(watchedAmount) && watchedAmount >= 100 ? formatCurrency(watchedAmount) : 'Now'}
            </>
          )}
        </Button>

        {/* Confirmation Modal */}
        {depositData && (
          <ConfirmationModal
            open={open}
            handleFormReset={handleFormReset}
            setOpen={setOpen}
            user={user}
            data={depositData}
          />
        )}
      </form>
    </Form>
  );
};
