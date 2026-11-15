import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import PaystackPop from "@paystack/inline-js";
import { ArrowRight, Building2, CreditCard, Lock, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn, formatCurrency } from "@/lib/utils";
import { depositFunds } from "@/services/PaymentService";
import useAuthStore from "@/store/authStore";
import type { MinimalUser, User } from "@/types/user";

type QuickMethod = "paystack" | "transfer";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

interface MiniDepositWidgetProps {
  user?: User | MinimalUser | null;
  onSuccess?: () => void;
  compact?: boolean;
  className?: string;
}

export function MiniDepositWidget({
  user: propUser,
  onSuccess,
  compact = false,
  className,
}: MiniDepositWidgetProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, minimalUser, syncUser } = useAuthStore();

  const activeUser = propUser ?? minimalUser;

  const [method, setMethod] = useState<QuickMethod>("paystack");
  const [amount, setAmount] = useState<number>(1000);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated && !propUser) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center space-y-3",
          className,
        )}
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#0185B6]/10 text-[#0185B6]">
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#0A4B7F]">Quick Wallet Top-Up</h3>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to fund your wallet instantly with Card, Transfer, or USSD.
          </p>
        </div>
        <Button
          asChild
          className="w-full rounded-full bg-[#0185B6] hover:bg-[#0A4B7F] text-white font-bold"
        >
          <Link to="/auth/login">Sign In to Deposit</Link>
        </Button>
      </div>
    );
  }

  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    if (!Number.isFinite(amount) || amount < 100) {
      toast.error("Minimum deposit is ₦100.");
      return;
    }

    if (method === "transfer") {
      onSuccess?.();
      await navigate({
        to: "/deposit/sarepay-transfer",
        search: { amount },
      });
      return;
    }

    try {
      setLoading(true);
      const response = await depositFunds(activeUser.customerId, amount, "Paystack");
      if (!response?.transactionRefrence) {
        throw new Error("Could not initialize payment.");
      }

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key:
          import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
          "pk_test_ca2dd4df87ee7d55fafcf8670fdc1479db22ac3d",
        email: activeUser.email,
        amount: response.amount * 100,
        ref: response.transactionRefrence,
        callback: (paystackRes) => {
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          syncUser();
          onSuccess?.();
          navigate({
            to: "/deposit/verify/$depositId",
            params: { depositId: paystackRes.reference },
          });
        },
        onClose: () => {
          toast.warning("Payment window closed before completion.");
        },
      });
    } catch (error: any) {
      toast.error(error?.message || "Could not start deposit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleFund}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        compact ? "p-4 space-y-3.5" : "p-5 space-y-4",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#01B1A8] to-[#0185B6] text-white shadow-sm">
            <Wallet className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-[#0A4B7F] leading-tight">
              Quick Deposit
            </h3>
            <p className="text-[11px] text-slate-500">
              Balance:{" "}
              <strong className="text-slate-800 tabular-nums">
                {formatCurrency(activeUser?.walletBalance ?? 0)}
              </strong>
            </p>
          </div>
        </div>
        <Link
          to="/deposit"
          className="text-[11px] font-bold text-[#0185B6] hover:underline shrink-0"
        >
          Full options
        </Link>
      </div>

      {/* Method Toggle */}
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMethod("paystack")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            method === "paystack"
              ? "bg-white text-[#0A4B7F] shadow-sm"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Card / USSD
        </button>
        <button
          type="button"
          onClick={() => setMethod("transfer")}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-bold transition-all cursor-pointer",
            method === "transfer"
              ? "bg-white text-[#0A4B7F] shadow-sm"
              : "text-slate-600 hover:text-slate-900",
          )}
        >
          <Building2 className="w-3.5 h-3.5" />
          Bank Transfer
        </button>
      </div>

      {/* Quick Amounts */}
      <div className="grid grid-cols-4 gap-1.5">
        {QUICK_AMOUNTS.map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setAmount(val)}
            className={cn(
              "rounded-xl py-1.5 text-xs font-bold border transition-all cursor-pointer tabular-nums",
              amount === val
                ? "bg-[#0A4B7F] text-white border-[#0A4B7F] shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
            )}
          >
            ₦{val.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Custom Amount Input */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
          ₦
        </span>
        <Input
          type="number"
          inputMode="numeric"
          min={100}
          aria-label="Deposit amount in Naira"
          placeholder="Enter amount (min ₦100)"
          value={Number.isFinite(amount) && amount > 0 ? amount : ""}
          onChange={(e) => {
            const val = e.target.valueAsNumber;
            setAmount(Number.isNaN(val) ? 0 : Math.max(0, val));
          }}
          className="pl-8 font-bold text-[#0A4B7F] tabular-nums rounded-xl h-10 border-slate-200"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !Number.isFinite(amount) || amount < 100}
        className="w-full h-10 rounded-full bg-[#FF005C] hover:bg-[#e00050] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 cursor-pointer"
      >
        {loading ? (
          <>
            <Spinner className="mr-2" /> Starting payment...
          </>
        ) : (
          <>
            Fund {Number.isFinite(amount) && amount >= 100 ? formatCurrency(amount) : "Wallet"}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </>
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        {method === "paystack" ? (
          <>
            <Lock className="w-3 h-3 text-emerald-500" /> Secured by Paystack · Instant credit
          </>
        ) : (
          <>
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Instant Sarepay account transfer
          </>
        )}
      </p>
    </form>
  );
}

