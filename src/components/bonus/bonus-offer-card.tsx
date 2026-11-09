import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronDown, ChevronRight, Gift, LoaderCircle, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BonusPromotion } from '@/services/PromotionService';
import {
	actionLink,
	dayLabel,
	hasNoEnd,
	naira,
	rewardNote,
	rewardText,
	shortDate,
	statusView,
	taskNote,
	taskText,
	termsList,
	type Tone,
} from '@/lib/bonus-words';
import { useClaimBonus } from '@/hooks/useBonusPromotions';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const TONES: Record<Tone, { panel: string; bar: string }> = {
	green: { panel: 'bg-emerald-50 text-emerald-900 ring-emerald-100', bar: 'from-emerald-400 to-emerald-600' },
	blue: { panel: 'bg-sky-50 text-sky-950 ring-sky-100', bar: 'from-cyan-400 to-[#0185B6]' },
	amber: { panel: 'bg-amber-50 text-amber-950 ring-amber-100', bar: 'from-amber-300 to-amber-500' },
	slate: { panel: 'bg-slate-50 text-slate-700 ring-slate-100', bar: 'from-slate-300 to-slate-400' },
	violet: { panel: 'bg-violet-50 text-violet-900 ring-violet-100', bar: 'from-violet-400 to-violet-600' },
};

const primaryButton =
	'inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#01B1A8] to-[#0185B6] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition hover:shadow-xl hover:shadow-cyan-600/30 hover:brightness-105 active:scale-[0.98] disabled:opacity-60';

function AppLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
	if (/^https?:\/\//i.test(to)) {
		return (
			<a href={to} className={className} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		);
	}
	return (
		<Link to={to as any} className={className}>
			{children}
		</Link>
	);
}

/** The pictures, turning by themselves; a branded panel with the reward when there are none */
function Media({ promo, wide }: { promo: BonusPromotion; wide?: boolean }) {
	const images = promo.images ?? [];
	const [shown, setShown] = useState(0);
	useEffect(() => {
		if (images.length < 2 || reducedMotion()) return;
		const timer = window.setInterval(() => setShown((i) => (i + 1) % images.length), 5000);
		return () => window.clearInterval(timer);
	}, [images.length]);

	const badge = promo.onNow ? 'On now' : promo.nextOn ? `Next: ${dayLabel(promo.nextOn)}` : '';
	return (
		<div className={cn('relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#01B1A8] via-[#0195B6] to-[#0165A6]', wide && 'md:aspect-auto md:min-h-[340px] md:w-[52%] md:shrink-0')}>
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
					className={cn(
						'absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.03]',
						i === shown ? 'opacity-100' : 'opacity-0'
					)}
				/>
			))}
			{!images.length && (
				<div className="absolute inset-0 flex flex-col items-center justify-center pb-12 text-white" aria-hidden>
					<div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
					<div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-white/10" />
					<Gift className="h-10 w-10 opacity-90" />
					<p className="mt-2 text-4xl font-black tracking-tight drop-shadow-sm">{naira(promo.rewardAmount)}</p>
					<p className="text-xs font-bold uppercase tracking-[0.3em] opacity-90">Free ticket</p>
				</div>
			)}
			{/* Legible words over any picture */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

			{badge && (
				<span
					className={cn(
						'absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-md',
						promo.onNow ? 'bg-emerald-500 text-white' : 'bg-white/95 text-slate-800'
					)}
				>
					{promo.onNow && (
						<span className="relative flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 motion-reduce:animate-none" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
						</span>
					)}
					{badge}
				</span>
			)}
			{images.length > 0 && (
				<span className="absolute right-3 top-3 rounded-full bg-[#FFF100] px-3 py-1 text-xs font-black text-[#0A4B7F] shadow-md">
					{naira(promo.rewardAmount)} FREE
				</span>
			)}

			<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
				<div className="min-w-0 text-white">
					{promo.when && <p className="truncate text-xs font-bold uppercase tracking-wider drop-shadow">{promo.when}</p>}
					{!hasNoEnd(promo) && <p className="text-[11px] font-medium text-white/80 drop-shadow">Until {shortDate(promo.endsAt)}</p>}
				</div>
				{images.length > 1 && (
					<div className="flex shrink-0 gap-1.5">
						{images.map((image, i) => (
							<button
								key={image.url}
								type="button"
								onClick={() => setShown(i)}
								aria-label={`Picture ${i + 1} of ${images.length}`}
								aria-current={i === shown}
								className={cn('h-1.5 rounded-full shadow transition-all', i === shown ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80')}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function Fact({ icon: Icon, label, value, note, accent }: { icon: typeof Gift; label: string; value: string; note?: string; accent?: boolean }) {
	return (
		<div className={cn('rounded-2xl p-3 ring-1', accent ? 'bg-amber-50/80 ring-amber-100' : 'bg-slate-50 ring-slate-100')}>
			<dt className={cn('flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider', accent ? 'text-amber-700' : 'text-slate-400')}>
				<Icon className="h-3.5 w-3.5" aria-hidden />
				{label}
			</dt>
			<dd className={cn('mt-1 text-sm font-bold leading-snug', accent ? 'text-amber-950' : 'text-slate-800')}>{value}</dd>
			{note && <dd className="mt-0.5 text-xs leading-snug text-slate-500">{note}</dd>}
		</div>
	);
}

export default function BonusOfferCard({ promo, signedIn, wide }: { promo: BonusPromotion; signedIn: boolean; wide?: boolean }) {
	const [details, setDetails] = useState(false);
	const claim = useClaimBonus();
	const view = statusView(promo);
	const action = actionLink(promo);
	const tone = view ? TONES[view.tone] : null;
	const claimable = promo.mine?.status === 'Claimable';

	return (
		<article
			className={cn(
				'group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-[0_14px_40px_-20px_rgba(1,101,166,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-22px_rgba(1,101,166,0.55)]',
				wide && 'md:flex-row'
			)}
		>
			<Media promo={promo} wide={wide} />

			<div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
				<div>
					<h3 className="text-lg font-extrabold leading-snug text-slate-900 sm:text-xl">{promo.headline}</h3>
					{promo.text && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500">{promo.text}</p>}
				</div>

				{promo.kind && (
					<dl className="grid grid-cols-2 gap-2">
						<Fact icon={Target} label="To get it" value={taskText(promo)} note={taskNote(promo)} />
						<Fact icon={Gift} label="You get" value={rewardText(promo)} note={rewardNote(promo)} accent />
					</dl>
				)}

				{view && tone && (
					<div className={cn('rounded-2xl p-3 ring-1', tone.panel)} role="status">
						<p className="text-sm font-bold">{view.title}</p>
						{view.progress && (
							<div className="mt-2">
								<div className="h-2 overflow-hidden rounded-full bg-white/80 ring-1 ring-black/5" role="progressbar" aria-valuemin={0} aria-valuemax={view.progress.max} aria-valuenow={view.progress.value} aria-label={view.progress.text}>
									<div className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', tone.bar)} style={{ width: `${Math.min(100, (view.progress.value / Math.max(1, view.progress.max)) * 100)}%` }} />
								</div>
								<p className="mt-1 text-xs font-semibold tabular-nums opacity-80">{view.progress.text}</p>
							</div>
						)}
						{view.detail && <p className="mt-1 text-xs opacity-80">{view.detail}</p>}
					</div>
				)}

				<div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
					{!signedIn ? (
						<>
							{promo.buttonLabel && promo.buttonLink ? (
								<AppLink to={promo.buttonLink} className={primaryButton}>
									{promo.buttonLabel} <ChevronRight className="h-4 w-4" />
								</AppLink>
							) : (
								<Link to="/auth/signup" className={primaryButton}>
									{promo.kind === 'Claim' ? 'Join to claim' : 'Join now'} <ChevronRight className="h-4 w-4" />
								</Link>
							)}
							<Link to="/auth/login" className="text-sm font-semibold text-[#0185B6] hover:underline">
								Log in
							</Link>
						</>
					) : claimable ? (
						<button type="button" className={primaryButton} disabled={claim.isPending} onClick={() => claim.mutate(promo)}>
							{claim.isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
							{claim.isPending ? 'Claiming…' : 'Claim free ticket'}
						</button>
					) : action ? (
						<AppLink to={action.to} className={primaryButton}>
							{action.label} <ChevronRight className="h-4 w-4" />
						</AppLink>
					) : null}

					<button
						type="button"
						onClick={() => setDetails((open) => !open)}
						aria-expanded={details}
						className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
					>
						Details <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', details && 'rotate-180')} />
					</button>
				</div>

				{details && (
					<ul className="space-y-1.5 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
						{termsList(promo).map((line) => (
							<li key={line} className="flex gap-2">
								<span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" aria-hidden />
								<span>{line}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</article>
	);
}
