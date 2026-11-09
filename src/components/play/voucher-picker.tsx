import { Check, Gift, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Voucher } from '@/services/BonusService';
import { naira, shortDate, ticketsLeft, timeLeft, type VoucherCheck } from '@/lib/bonus-words';

/**
 * "Pay with a free ticket" in My Games: turn it on, pick a voucher, and see at once whether this ticket fits it.
 * The page owns the choice and the check, so it can change the total and the Place Bet button.
 */
export default function VoucherPicker({
	vouchers,
	selectedId,
	onSelect,
	check,
}: {
	vouchers: Voucher[];
	selectedId: string | null;
	onSelect: (id: string | null) => void;
	check: VoucherCheck | null;
}) {
	if (!vouchers.length) return null;
	const on = !!selectedId;

	return (
		<div className={cn('mt-4 rounded-2xl p-3 ring-1 transition-colors', on ? 'bg-amber-50 ring-amber-200' : 'bg-slate-50 ring-slate-200')}>
			<label className="flex cursor-pointer items-center justify-between gap-3">
				<span className="flex items-center gap-2">
					<span className={cn('flex h-8 w-8 items-center justify-center rounded-xl', on ? 'bg-[#FFF100] text-[#0A4B7F]' : 'bg-white text-amber-600 ring-1 ring-slate-200')}>
						<Gift className="h-4 w-4" aria-hidden />
					</span>
					<span>
						<span className="block text-sm font-bold text-slate-800">Pay with a free ticket</span>
						<span className="block text-xs text-slate-500">
							You have {vouchers.length} {vouchers.length === 1 ? 'free ticket' : 'free tickets'}
						</span>
					</span>
				</span>
				{/* A switch */}
				<input
					type="checkbox"
					className="peer sr-only"
					checked={on}
					onChange={(e) => onSelect(e.target.checked ? vouchers[0].id : null)}
					aria-label="Pay with a free ticket"
				/>
				<span className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#0185B6]', on ? 'bg-[#0185B6]' : 'bg-slate-300')} aria-hidden>
					<span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
				</span>
			</label>

			{on && (
				<div className="mt-3 space-y-2">
					{vouchers.length > 1 && (
						<div className="space-y-1.5" role="radiogroup" aria-label="Choose a free ticket">
							{vouchers.map((voucher) => {
								const time = timeLeft(voucher.expirationDate);
								const chosen = voucher.id === selectedId;
								return (
									<button
										key={voucher.id}
										type="button"
										role="radio"
										aria-checked={chosen}
										onClick={() => onSelect(voucher.id)}
										className={cn(
											'flex w-full items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-left text-xs ring-1 transition',
											chosen ? 'ring-2 ring-[#0185B6]' : 'ring-slate-200 hover:ring-slate-300'
										)}
									>
										<span className="font-bold text-slate-800">
											{naira(voucher.amount)} · {voucher.displayName || 'Free ticket'}
										</span>
										<span className={cn('shrink-0', time.urgent ? 'font-semibold text-red-600' : 'text-slate-500')}>{time.text}</span>
									</button>
								);
							})}
						</div>
					)}
					{vouchers.length === 1 && (
						<p className="text-xs text-slate-600">
							{naira(vouchers[0].amount)} free ticket · {ticketsLeft(vouchers[0])} left · use by {shortDate(vouchers[0].expirationDate)}
						</p>
					)}
					{check && (
						<ul className="space-y-1">
							{check.checks.map((item) => (
								<li key={item.label} className={cn('flex items-start gap-1.5 text-xs', item.ok ? 'text-emerald-700' : 'font-semibold text-red-600')}>
									{item.ok ? <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <X className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
									{item.label}
								</li>
							))}
						</ul>
					)}
					<p className="text-[11px] text-slate-500">Any part of the free ticket you don't stake is not kept.</p>
				</div>
			)}
		</div>
	);
}
