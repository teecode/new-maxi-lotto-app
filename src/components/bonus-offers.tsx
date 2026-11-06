import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBonusPromotions } from '@/hooks/useBonusPromotions';
import type { BonusPromotion } from '@/services/PromotionService';

// The bonuses the back office has put on the website (Bonus Vouchers → Promote), each with its pictures.
// Renders nothing until there is at least one, so the page is unchanged without them.

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// "Tomorrow", or "Sat 14 Nov"
function dayLabel(iso: string): string {
	const day = new Date(iso.slice(0, 10) + 'T00:00:00');
	const tomorrow = new Date();
	tomorrow.setHours(0, 0, 0, 0);
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (day.getTime() === tomorrow.getTime()) return 'Tomorrow';
	return day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function OfferButton({ label, link }: { label: string; link: string }) {
	const className =
		'inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-500/20 transition hover:from-cyan-600 hover:to-teal-600 hover:shadow-lg';
	if (/^https?:\/\//i.test(link)) {
		return (
			<a href={link} className={className} target="_blank" rel="noopener noreferrer">
				{label} <ChevronRight className="h-4 w-4" />
			</a>
		);
	}
	return (
		<Link to={link as any} className={className}>
			{label} <ChevronRight className="h-4 w-4" />
		</Link>
	);
}

function OfferCard({ promo }: { promo: BonusPromotion }) {
	const images = promo.images ?? [];
	const [shown, setShown] = useState(0);

	// Turns through the bonus's pictures, unless the visitor prefers less motion
	useEffect(() => {
		if (images.length < 2 || reducedMotion()) return;
		const timer = window.setInterval(() => setShown((i) => (i + 1) % images.length), 5000);
		return () => window.clearInterval(timer);
	}, [images.length]);

	const badge = promo.onNow ? 'On now' : promo.nextOn ? `Next: ${dayLabel(promo.nextOn)}` : '';

	return (
		<article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
			<div className="relative aspect-[2/1] overflow-hidden bg-gradient-to-br from-[#01B1A8] via-[#0195B6] to-[#0165A6]">
				{images.map((image, i) => (
					<img
						key={image.url}
						src={image.url}
						alt={i === shown ? image.alt || promo.headline : ''}
						aria-hidden={i !== shown}
						width={image.width || undefined}
						height={image.height || undefined}
						loading="lazy"
						decoding="async"
						className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-700', i === shown ? 'opacity-100' : 'opacity-0')}
					/>
				))}
				{!images.length && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Gift className="h-16 w-16 text-white/80" aria-hidden />
					</div>
				)}
				{badge && (
					<span
						className={cn(
							'absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow',
							promo.onNow ? 'bg-emerald-500' : 'bg-amber-500'
						)}
					>
						{badge}
					</span>
				)}
				{images.length > 1 && (
					<div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
						{images.map((image, i) => (
							<button
								key={image.url}
								type="button"
								onClick={() => setShown(i)}
								aria-label={`Picture ${i + 1} of ${images.length}`}
								aria-current={i === shown}
								className={cn('h-1.5 rounded-full shadow transition-all', i === shown ? 'w-5 bg-white' : 'w-1.5 bg-white/60')}
							/>
						))}
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-2 p-5">
				{promo.when && <p className="text-xs font-bold uppercase tracking-wider text-teal-600">{promo.when}</p>}
				<h3 className="text-lg font-bold leading-snug text-slate-800">{promo.headline}</h3>
				{promo.text && <p className="text-sm leading-relaxed text-slate-500">{promo.text}</p>}
				{promo.buttonLabel && promo.buttonLink && (
					<div className="mt-auto pt-3">
						<OfferButton label={promo.buttonLabel} link={promo.buttonLink} />
					</div>
				)}
			</div>
		</article>
	);
}

export default function BonusOffers({
	heading = 'Bonus offers',
	subheading = 'Free tickets you can earn right now',
	embedded = false,
	className,
}: {
	heading?: string;
	subheading?: string;
	/** Inside another page's column: no band of its own */
	embedded?: boolean;
	className?: string;
}) {
	const { data } = useBonusPromotions();
	const promos = data ?? [];
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

	if (!promos.length) return null;

	return (
		<section aria-labelledby="bonus-offers-title" className={cn(embedded ? '' : 'bg-gray-50 py-12 sm:py-16', className)}>
			<div className={embedded ? '' : 'container'}>
				<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
					<div>
						<div className="flex items-center gap-3">
							<div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 to-teal-500" />
							<h2 id="bonus-offers-title" className="text-2xl font-bold text-slate-800 sm:text-3xl">
								{heading}
							</h2>
						</div>
						{subheading && <p className="mt-1 text-sm text-slate-500">{subheading}</p>}
					</div>
					{(canPrev || canNext) && (
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => emblaApi?.scrollPrev()}
								disabled={!canPrev}
								aria-label="Previous offers"
								className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-40"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								type="button"
								onClick={() => emblaApi?.scrollNext()}
								disabled={!canNext}
								aria-label="More offers"
								className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-40"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
					)}
				</div>

				<div className="overflow-hidden" ref={emblaRef}>
					<div className="-ml-4 flex touch-pan-y">
						{promos.map((promo) => (
							<div
								key={promo.id}
								className={cn('min-w-0 shrink-0 grow-0 pl-4 sm:basis-1/2', promos.length === 1 ? 'basis-full' : 'basis-[88%]', promos.length > 2 ? 'xl:basis-1/3' : '')}
							>
								<OfferCard promo={promo} />
							</div>
						))}
					</div>
				</div>

				<p className="mt-4 text-xs text-slate-400">
					18+ only. Terms apply. Free tickets are for play and cannot be withdrawn. See{' '}
					<Link to="/promotions" className="underline hover:text-slate-600">
						Promotions
					</Link>
					.
				</p>
			</div>
		</section>
	);
}
