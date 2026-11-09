import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Gift, LoaderCircle, PartyPopper, Sparkles, Target, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBonusOffers, useClaimBonus } from '@/hooks/useBonusPromotions';
import BonusOfferCard from '@/components/bonus/bonus-offer-card';
import { rewardText } from '@/lib/bonus-words';
import type { BonusPromotion } from '@/services/PromotionService';

// The bonuses the back office has put on the website (Bonus Vouchers → Promote), with each signed-in customer's
// progress and a Claim button where there is one. Renders nothing until there is at least one offer.

const STEPS = [
	{ icon: Target, title: 'Do the task', text: 'Play, deposit, or just claim' },
	{ icon: Gift, title: 'Get a free ticket', text: 'It lands in My bonuses' },
	{ icon: Ticket, title: 'Play it free', text: 'Wins go to your wallet' },
];

function ClaimStrip({ count, first }: { count: number; first: BonusPromotion }) {
	const claim = useClaimBonus();
	return (
		<div className="mt-8 flex flex-col gap-3 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white shadow-lg shadow-emerald-600/20 sm:flex-row sm:items-center sm:justify-between sm:p-5">
			<div className="flex items-center gap-3">
				<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20">
					<PartyPopper className="h-6 w-6" aria-hidden />
				</span>
				<div>
					<p className="font-bold">You have {count === 1 ? 'a free ticket' : `${count} free tickets`} to claim</p>
					<p className="text-sm text-white/85">{count === 1 ? `${first.headline}: ${rewardText(first)}` : 'Claim each one below.'}</p>
				</div>
			</div>
			{count === 1 && (
				<button
					type="button"
					onClick={() => claim.mutate(first)}
					disabled={claim.isPending}
					className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 shadow transition hover:bg-emerald-50 disabled:opacity-60"
				>
					{claim.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
					{claim.isPending ? 'Claiming…' : 'Claim now'}
				</button>
			)}
		</div>
	);
}

export default function BonusOffers({
	heading = 'Bonus offers',
	subheading = 'Complete a simple task and your next ticket is on us.',
	embedded = false,
	className,
}: {
	heading?: string;
	subheading?: string;
	/** Inside another page's column: no band of its own */
	embedded?: boolean;
	className?: string;
}) {
	const { offers, personal, signedIn } = useBonusOffers();
	const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	const update = useCallback(() => {
		if (!emblaApi) return;
		setCanPrev(emblaApi.canScrollPrev());
		setCanNext(emblaApi.canScrollNext());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		update();
		emblaApi.on('select', update);
		emblaApi.on('reInit', update);
		return () => {
			emblaApi.off('select', update);
			emblaApi.off('reInit', update);
		};
	}, [emblaApi, update]);

	if (!offers.length) return null;

	const claimables = personal ? offers.filter((o) => o.mine?.status === 'Claimable') : [];
	const single = offers.length === 1;

	return (
		<section
			aria-labelledby="bonus-offers-title"
			className={cn(!embedded && 'relative overflow-hidden bg-gradient-to-b from-[#ecf9ff] via-white to-white py-14 sm:py-20', className)}
		>
			{!embedded && (
				<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
					<div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
					<div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#FFF100]/25 blur-3xl" />
				</div>
			)}

			<div className={embedded ? '' : 'container relative'}>
				<header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-xl">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF100] px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#0A4B7F] shadow-sm">
							<Sparkles className="h-3.5 w-3.5" aria-hidden /> Free tickets
						</span>
						<h2 id="bonus-offers-title" className="mt-3 text-3xl font-black tracking-tight text-[#0A4B7F] sm:text-4xl">
							{heading}
						</h2>
						{subheading && <p className="mt-2 text-sm text-slate-500 sm:text-base">{subheading}</p>}
					</div>

					<ol className="grid grid-cols-3 gap-2 sm:gap-3 lg:max-w-xl" aria-label="How it works">
						{STEPS.map(({ icon: Icon, title, text }, i) => (
							<li key={title} className="relative rounded-2xl bg-white/90 p-3 shadow-sm ring-1 ring-slate-100 backdrop-blur">
								<div className="flex items-center gap-2">
									<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#01B1A8] to-[#0185B6] text-xs font-black text-white">
										{i + 1}
									</span>
									<Icon className="hidden h-4 w-4 text-[#0185B6] sm:block" aria-hidden />
								</div>
								<p className="mt-2 text-xs font-bold text-slate-800 sm:text-sm">{title}</p>
								<p className="mt-0.5 text-[11px] leading-snug text-slate-500 sm:text-xs">{text}</p>
							</li>
						))}
					</ol>
				</header>

				{claimables.length > 0 && <ClaimStrip count={claimables.length} first={claimables[0]} />}

				<div className={cn('mt-8', single ? '' : 'overflow-hidden')} ref={single ? undefined : emblaRef}>
					{single ? (
						<BonusOfferCard promo={offers[0]} signedIn={signedIn} wide />
					) : (
						<div className="-ml-5 flex touch-pan-y pb-2">
							{offers.map((promo) => (
								<div key={promo.id} className={cn('min-w-0 shrink-0 grow-0 basis-[88%] pl-5 sm:basis-1/2', offers.length > 2 && 'xl:basis-1/3')}>
									<BonusOfferCard promo={promo} signedIn={signedIn} />
								</div>
							))}
						</div>
					)}
				</div>

				<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
					<p className="text-xs text-slate-400">
						18+ only. Terms apply. Free tickets are for play and cannot be withdrawn.{' '}
						<Link to={(signedIn ? '/bonuses' : '/promotions') as any} className="font-semibold text-[#0185B6] hover:underline">
							{signedIn ? 'My bonuses & free tickets' : 'How bonuses work'}
						</Link>
					</p>
					{!single && (canPrev || canNext) && (
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => emblaApi?.scrollPrev()}
								disabled={!canPrev}
								aria-label="Previous offers"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								type="button"
								onClick={() => emblaApi?.scrollNext()}
								disabled={!canNext}
								aria-label="More offers"
								className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
