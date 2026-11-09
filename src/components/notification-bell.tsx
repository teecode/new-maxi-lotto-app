import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Bell, Gift, LoaderCircle, Ticket } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useClaimBonus, useMarkNotifications, useMyBonuses, useMyVouchers, useNotifications } from '@/hooks/useBonusPromotions';
import { naira, rewardText } from '@/lib/bonus-words';
import type { BonusPromotion } from '@/services/PromotionService';

function ClaimRow({ bonus }: { bonus: BonusPromotion }) {
	const claim = useClaimBonus();
	return (
		<li className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
			<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
				<Gift className="h-4 w-4" aria-hidden />
			</span>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-bold text-emerald-900">{bonus.headline}</p>
				<p className="text-xs text-emerald-800">{rewardText(bonus)} to claim</p>
			</div>
			<button
				type="button"
				onClick={() => claim.mutate(bonus)}
				disabled={claim.isPending}
				className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
			>
				{claim.isPending && <LoaderCircle className="h-3 w-3 animate-spin" />}
				Claim
			</button>
		</li>
	);
}

/** The bell in the header for signed-in customers: free tickets to claim, then their notifications */
export default function NotificationBell() {
	const [open, setOpen] = useState(false);
	const { data: notifications = [] } = useNotifications();
	const { data: bonuses = [] } = useMyBonuses();
	const { data: vouchers = [] } = useMyVouchers();
	const { markOne, markAll } = useMarkNotifications();

	const claimable = bonuses.filter((b) => b.mine?.status === 'Claimable');
	const unread = notifications.filter((n) => !n.isRead);
	const count = unread.length + claimable.length;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15"
					aria-label={count ? `Notifications, ${count} new` : 'Notifications'}
				>
					<Bell className="h-5 w-5" />
					{count > 0 && (
						<span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#FFF100] px-1 text-[10px] font-black text-[#0A4B7F] ring-2 ring-[#0185B6]">
							{count > 9 ? '9+' : count}
						</span>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent align="end" sideOffset={10} className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl p-0">
				<div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
					<p className="font-bold text-slate-900">Notifications</p>
					{unread.length > 0 && (
						<button type="button" onClick={() => markAll()} className="text-xs font-semibold text-[#0185B6] hover:underline">
							Mark all read
						</button>
					)}
				</div>

				<div className="max-h-[70vh] overflow-y-auto p-3">
					{claimable.length > 0 && (
						<ul className="mb-3 space-y-2">
							{claimable.map((bonus) => (
								<ClaimRow key={bonus.id} bonus={bonus} />
							))}
						</ul>
					)}

					{vouchers.length > 0 && (
						<Link
							to={'/bonuses' as any}
							onClick={() => setOpen(false)}
							className="mb-3 flex items-center gap-3 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-100 transition hover:bg-amber-100/70"
						>
							<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF100] text-[#0A4B7F]">
								<Ticket className="h-4 w-4" aria-hidden />
							</span>
							<span className="min-w-0 flex-1 text-sm">
								<span className="block font-bold text-amber-950">
									{vouchers.length === 1 ? '1 free ticket' : `${vouchers.length} free tickets`} to play
								</span>
								<span className="block text-xs text-amber-800">Worth {naira(vouchers.reduce((sum, v) => sum + v.amount, 0))} · see them</span>
							</span>
						</Link>
					)}

					{notifications.length === 0 && claimable.length === 0 ? (
						<p className="px-2 py-8 text-center text-sm text-slate-500">You're all caught up.</p>
					) : (
						<ul className="space-y-1">
							{notifications.map((n) => {
								const toVouchers = n.code === 'NEW_VOUCHER';
								const body = (
									<>
										<span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.isRead ? 'bg-transparent' : 'bg-[#0185B6]')} aria-hidden />
										<span className="min-w-0 flex-1">
											<span className={cn('block text-sm', n.isRead ? 'font-medium text-slate-600' : 'font-bold text-slate-900')}>{n.title || 'Notification'}</span>
											{n.message && <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{n.message}</span>}
											{toVouchers && <span className="mt-1 block text-xs font-semibold text-[#0185B6]">See my free tickets →</span>}
										</span>
									</>
								);
								const className = 'flex w-full gap-2 rounded-xl px-2 py-2.5 text-left transition hover:bg-slate-50';
								const onClick = () => {
									if (!n.isRead) markOne(n.id);
									if (toVouchers) setOpen(false);
								};
								return (
									<li key={n.id}>
										{toVouchers ? (
											<Link to={'/bonuses' as any} className={className} onClick={onClick}>
												{body}
											</Link>
										) : (
											<button type="button" className={className} onClick={onClick}>
												{body}
											</button>
										)}
									</li>
								);
							})}
						</ul>
					)}
				</div>

				<div className="border-t border-slate-100 p-2">
					<Link to={'/bonuses' as any} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-center text-sm font-semibold text-[#0185B6] hover:bg-slate-50">
						My bonuses & free tickets
					</Link>
				</div>
			</PopoverContent>
		</Popover>
	);
}
