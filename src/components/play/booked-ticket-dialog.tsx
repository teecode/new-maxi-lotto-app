import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BookedTicketDialogProps {
  ticketId: string | number | null;
  onClose: () => void;
}

export function BookedTicketDialog({ ticketId, onClose }: BookedTicketDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!ticketId) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(ticketId));
      setCopied(true);
      toast.success("Booking ID copied!");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy automatically — please select the ID.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Ticket className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#0A4B7F] mb-2">
          Ticket Booked Successfully!
        </h3>
        <p className="text-gray-600 mb-4 text-sm">
          Show or share this booking ID at any MaxiLotto shop:
        </p>

        <div className="bg-gradient-to-r from-[#0185B6]/10 to-[#01B1A8]/10 border-2 border-dashed border-[#0185B6] rounded-2xl p-4 mb-4 flex items-center justify-center gap-3">
          <span className="text-3xl font-black tracking-widest text-[#0A4B7F] select-all tabular-nums">
            {ticketId}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="Copy booking ID"
            className="rounded-xl border-[#0185B6]/30 text-[#0A4B7F] hover:bg-[#0185B6]/10 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <p className="text-gray-600 font-medium mb-6 text-xs leading-relaxed">
          Proceed to any <strong>MaxiLotto Shop</strong> near you to pay and print your ticket.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-xl py-5 font-bold border-slate-200 text-[#0A4B7F]"
          >
            <Link to="/tickets" onClick={onClose}>
              View My Bets
            </Link>
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-[#0185B6] to-[#01B1A8] text-white rounded-xl py-5 font-bold hover:opacity-90 shadow-md transition-all"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

