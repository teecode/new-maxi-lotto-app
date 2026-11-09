import { Link } from '@tanstack/react-router';
import { CalendarClock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Voucher } from '@/services/BonusService';
import { ACCUMULATOR, naira, shortDate, ticketsLeft, timeLeft, voucherRules } from '@/lib/bonus-words';
import { useFetchDailyGames, useGetBetTypes } from '@/hooks/useGames';

/** Names for the ids in a voucher's rules, from the games and bet types the site already loads */
export function useRuleNames() {
	const { data: games } = useFetchDailyGames();
	const { data: betTypes } = useGetBetTypes();
	return {
		gameName: (id: number) => games?.find((g) => g.templateGameId === id)?.gameName,
		betTypeName: (id: number) => {
			const type = betTypes?.find((b) => b.betTypeID === id);
			return type ? type.napDescription || type.nap || type.code : undefined;
		},
	};
}

/** A free ticket as a ticket stub: its value, how long is left, its limits, and a way to play it */
export default function VoucherCard({ voucher, showPlay = true }: { voucher: Voucher; showPlay?: boolean }) {
	const { gameName, betTypeName } = useRuleNames();
	const left = ticketsLeft(voucher);
	const time = timeLeft(voucher.expirationDate);
	const rules = voucherRules(voucher, gameName, betTypeName);

	return (
		<article className="relative flex overflow-hidden rounded-3xl bg-white shadow-[0_10px_30px_-18px_rgba(1,101,166,0.5)] ring-1 ring-slate-200/80">
			{/* The stub */}
			<div className="relative flex w-28 shrink-0 flex-col items-center justify-center bg-gradient-to-br from-[#01B1A8] via-[#0195B6] to-[#0165A6] px-2 py-5 text-center text-white sm:w-32">
				<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Free ticket</span>
				<span className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">{naira(voucher.amount)}</span>
				<span className="mt-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold">
					{left} of {voucher.freeTicketsNumber} left
				</span>
			</div>
			{/* Perforation between stub and body */}
			<div className="relative w-0 border-l-2 border-dashed border-slate-200" aria-hidden>
				<span className="absolute -left-[9px] -top-2 h-4 w-4 rounded-full bg-slate-100" />
				<span className="absolute -bottom-2 -left-[9px] h-4 w-4 rounded-full bg-slate-100" />
			</div>

			<div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
				<div className="flex flex-wrap items-start justify-between gap-2">
					<h3 className="min-w-0 font-bold leading-snug text-slate-900">{voucher.displayName || voucher.name || 'Free ticket'}</h3>
					{time.text && (
						<span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold', time.urgent ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600')}>
							<CalendarClock className="h-3 w-3" aria-hidden />
							{time.text}
						</span>
					)}
				</div>
				<p className="text-xs text-slate-500">
					Stake up to {naira(voucher.amount)} on one ticket. Use by {shortDate(voucher.expirationDate)}.
				</p>
				<ul className="flex flex-wrap gap-1.5">
					{rules.map((rule) => (
						<li key={rule} className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100">
							{rule}
						</li>
					))}
				</ul>
				{showPlay && (
					<div className="mt-auto pt-1">
						{/* An accumulator-only free ticket is played on the Accumulator page */}
						{voucher.ticketType === ACCUMULATOR ? (
							<Link
								to="/accumulator"
								search={{ voucher: voucher.id }}
								className="inline-flex items-center gap-1 rounded-full bg-[#0A4B7F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0185B6]"
							>
								Play an accumulator <ChevronRight className="h-3.5 w-3.5" />
							</Link>
						) : (
							<Link
								to="/play"
								search={{ voucher: voucher.id }}
								className="inline-flex items-center gap-1 rounded-full bg-[#0A4B7F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0185B6]"
							>
								Play it now <ChevronRight className="h-3.5 w-3.5" />
							</Link>
						)}
					</div>
				)}
			</div>
		</article>
	);
}
