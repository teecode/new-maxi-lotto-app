import type { BonusPromotion } from '@/services/PromotionService';
import type { Voucher } from '@/services/BonusService';

// How the website says a bonus in plain words, the same on every screen.

export const naira = (value: number | null | undefined) => `₦${Math.round(Number(value) || 0).toLocaleString('en-NG')}`;

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** "Today", "Tomorrow", or "Sat 14 Nov" */
export function dayLabel(iso: string | null | undefined): string {
	if (!iso) return '';
	const day = startOfDay(new Date(iso));
	const today = startOfDay(new Date());
	const diff = Math.round((day.getTime() - today.getTime()) / 86400000);
	if (diff === 0) return 'Today';
	if (diff === 1) return 'Tomorrow';
	return day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** "Sat 14 Nov" */
export const shortDate = (iso: string | null | undefined) =>
	iso ? new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : '';

/** How long until a moment: "3 days left", "5 hours left", "Ends soon", or "Expired" */
export function timeLeft(iso: string | null | undefined): { text: string; urgent: boolean } {
	if (!iso) return { text: '', urgent: false };
	const ms = new Date(iso).getTime() - Date.now();
	if (ms <= 0) return { text: 'Expired', urgent: true };
	const hours = ms / 3600000;
	if (hours < 1) return { text: 'Ends within the hour', urgent: true };
	if (hours < 24) return { text: `${Math.floor(hours)} ${plural(Math.floor(hours), 'hour', 'hours')} left`, urgent: true };
	const days = Math.floor(hours / 24);
	return { text: `${days} ${plural(days, 'day', 'days')} left`, urgent: days <= 1 };
}

/** What you get: "₦150 free ticket" or "3 free tickets of ₦150" */
export function rewardText(bonus: Pick<BonusPromotion, 'rewardAmount' | 'freeTickets'>): string {
	const tickets = bonus.freeTickets || 1;
	return tickets === 1 ? `${naira(bonus.rewardAmount)} free ticket` : `${tickets} free tickets of ${naira(bonus.rewardAmount)}`;
}

/** The small print under what you get: time to use it and the winning cap */
export function rewardNote(bonus: BonusPromotion): string {
	const parts: string[] = [];
	if (bonus.validDays) parts.push(`Use within ${bonus.validDays} ${plural(bonus.validDays, 'day', 'days')}`);
	else if (bonus.voucherExpiresAt) parts.push(`Use by ${shortDate(bonus.voucherExpiresAt)}`);
	if (bonus.maxWinAmount) parts.push(`win up to ${naira(bonus.maxWinAmount)}`);
	return parts.join(' · ');
}

/** What to do, in a few words: "Play 10 tickets", "Deposit ₦3,000", "Just claim it" */
export function taskText(bonus: BonusPromotion): string {
	const n = bonus.ticketCount || 0;
	const tickets = plural(n, 'ticket', 'tickets');
	switch (bonus.kind) {
		case 'Play':
			if (bonus.ticketKind === 'L') return bonus.repeatable ? `Every ${n} losing ${tickets}${bonus.streak ? ' in a row' : ''}` : `Lose ${n} ${tickets}${bonus.streak ? ' in a row' : ''}`;
			if (bonus.ticketKind === 'W') return bonus.repeatable ? `Every ${n} winning ${tickets}` : `Win ${n} ${tickets}`;
			return bonus.repeatable ? `Every ${n} ${tickets} you play` : `Play ${n} ${tickets}`;
		case 'Deposit':
			return bonus.repeatable ? `Every ${naira(bonus.depositAmount)} you deposit` : `Deposit ${naira(bonus.depositAmount)}`;
		case 'Claim':
			return 'Just claim it';
		case 'Signup':
			return bonus.anyReferralCode ? 'Sign up with a referral code' : 'Sign up with a promo code';
		default:
			return bonus.text || '';
	}
}

/** The small print under what to do */
export function taskNote(bonus: BonusPromotion): string {
	const parts: string[] = [];
	if (bonus.kind === 'Play' && bonus.minStake) parts.push(`${naira(bonus.minStake)} or more each`);
	if (bonus.kind === 'Play' && bonus.ticketKind !== 'T') parts.push('counted when the draw is settled');
	if (bonus.kind === 'Claim' && bonus.minimumDeposited) parts.push(`for players who have deposited ${naira(bonus.minimumDeposited)}+`);
	if (bonus.kind === 'Claim' && !bonus.minimumDeposited) parts.push('no deposit needed');
	if (bonus.kind === 'Signup') parts.push('new players only · given at sign-up');
	if (bonus.repeatable && bonus.maxPerCustomer) parts.push(`up to ${bonus.maxPerCustomer} ${plural(bonus.maxPerCustomer, 'time', 'times')}${bonus.scheduled ? ' each round' : ''}`);
	if (!bonus.repeatable && bonus.scheduled) parts.push('once each round');
	return parts.join(' · ');
}

/** The rules in a list, for "Details" */
export function termsList(bonus: BonusPromotion): string[] {
	const out: string[] = [];
	if (bonus.when) out.push(`On: ${bonus.when}.`);
	out.push(`Runs until ${shortDate(bonus.endsAt)}.`);
	if (bonus.kind === 'Play') out.push('Only tickets paid from your wallet count; tickets played with a free ticket and cancelled tickets do not.');
	if (bonus.kind === 'Deposit') out.push(bonus.scheduled ? 'Only deposits made on its days count.' : 'Only deposits made while it runs count.');
	if (bonus.kind === 'Signup') out.push('Given the moment you sign up with a qualifying code; it cannot be added to an existing account.');
	if (bonus.scheduled) out.push('Each round (days in a row, such as a weekend) starts from zero.');
	out.push('A free ticket pays your stake up to its value; your wallet is not charged.');
	if (bonus.maxWinAmount) out.push(`Winnings on a free ticket are capped at ${naira(bonus.maxWinAmount)}.`);
	out.push('Free tickets cannot be withdrawn. 18+ only.');
	return out;
}

export type Tone = 'green' | 'blue' | 'amber' | 'slate' | 'violet';

export interface StatusView {
	tone: Tone;
	title: string;
	detail?: string;
	/** A bar: value of max, with the words to show beside it */
	progress?: { value: number; max: number; text: string };
}

/** Where a signed-in customer stands, in words, with a progress bar when there is one to show */
export function statusView(bonus: BonusPromotion): StatusView | null {
	const mine = bonus.mine;
	if (!mine) return null;
	const until = bonus.roundEndsAt ? `Counts until ${shortDate(bonus.roundEndsAt)}` : undefined;
	switch (mine.status) {
		case 'Claimable':
			return { tone: 'green', title: 'Ready to claim', detail: 'Tap claim and it goes straight to your free tickets.' };
		case 'Locked': {
			const left = Math.max(0, mine.target - mine.progress);
			return {
				tone: 'amber',
				title: `Deposit ${naira(left)} more to unlock`,
				progress: { value: mine.progress, max: mine.target, text: `${naira(mine.progress)} of ${naira(mine.target)} deposited` }
			};
		}
		case 'InProgress': {
			const earned = mine.earnedThisRound > 0 ? `Earned ${mine.earnedThisRound} so far. ` : '';
			if (bonus.kind === 'Deposit') {
				return {
					tone: 'blue',
					title: mine.progress > 0 ? `${naira(mine.target - mine.progress)} more to go` : 'Not started yet',
					detail: `${earned}${until ?? ''}`.trim() || undefined,
					progress: { value: mine.progress, max: mine.target, text: `${naira(mine.progress)} of ${naira(mine.target)}` }
				};
			}
			const left = Math.max(0, mine.target - mine.progress);
			return {
				tone: 'blue',
				title: mine.progress > 0 ? `${left} more ${plural(left, 'ticket', 'tickets')} to go` : 'Not started yet',
				detail: `${earned}${until ?? ''}`.trim() || undefined,
				progress: { value: mine.progress, max: mine.target, text: `${mine.progress} of ${mine.target} tickets` }
			};
		}
		case 'Pending':
			return { tone: 'green', title: 'Done! Your free ticket is on its way', detail: 'It arrives within 5 minutes.', progress: { value: 1, max: 1, text: 'Complete' } };
		case 'Earned':
			if (bonus.kind === 'Signup') return { tone: 'violet', title: 'You got this when you signed up', detail: 'Find it in your free tickets.' };
			return { tone: 'violet', title: bonus.scheduled ? 'You earned it this round' : 'You earned this one', detail: 'Find it in your free tickets.' };
		case 'Done':
			return { tone: 'slate', title: 'You have had the most from this one', detail: bonus.scheduled ? 'It starts again next round.' : undefined };
		case 'SoldOut':
			return { tone: 'slate', title: 'All free tickets are gone for now', detail: bonus.scheduled ? 'Try again next round.' : undefined };
		case 'Waiting':
			return { tone: 'slate', title: bonus.nextOn ? `Starts ${dayLabel(bonus.nextOn)}` : 'Not on today' };
		default:
			return null;
	}
}

/** Where to go to do what the bonus asks */
export function actionLink(bonus: BonusPromotion): { label: string; to: string } | null {
	const status = bonus.mine?.status;
	if (status === 'Earned' || status === 'Pending') return { label: 'My free tickets', to: '/bonuses' };
	if (status === 'Locked') return { label: 'Deposit', to: '/deposit' };
	if (status === 'Done' || status === 'SoldOut' || status === 'Waiting' || status === 'Claimable') return null;
	if (bonus.kind === 'Deposit') return { label: 'Deposit now', to: '/deposit' };
	if (bonus.kind === 'Play') return { label: 'Play now', to: '/play' };
	return null;
}

// ---------- vouchers ----------

export const ticketsLeft = (voucher: Voucher) => Math.max(0, voucher.freeTicketsNumber - voucher.usedTicketsNumber);

/** A voucher's limits in short phrases, with names looked up from the games and bet types the page has */
export function voucherRules(voucher: Voucher, gameName: (id: number) => string | undefined, betTypeName: (id: number) => string | undefined): string[] {
	const out: string[] = [];
	if (voucher.allowedGameIds?.length) {
		const names = voucher.allowedGameIds.map((id) => gameName(id)).filter(Boolean) as string[];
		out.push(names.length ? `${names.join(', ')} only` : 'Selected games only');
	} else {
		out.push('Any game');
	}
	if (voucher.maxWinAmount) out.push(`Wins up to ${naira(voucher.maxWinAmount)}`);
	if (voucher.maxLines) out.push(`Up to ${voucher.maxLines} ${plural(voucher.maxLines, 'line', 'lines')}`);
	if (voucher.excludedBetTypeIds?.length) {
		const names = voucher.excludedBetTypeIds.map((id) => betTypeName(id)).filter(Boolean) as string[];
		out.push(names.length ? `Not for ${names.join(', ')}` : 'Some bet types excluded');
	}
	return out;
}

export interface VoucherCheck {
	ok: boolean;
	total: number;
	checks: { label: string; ok: boolean }[];
}

/**
 * Whether a ticket can be paid with a voucher, check by check, as the API will judge it (TicketValidationService):
 * the stake fits the voucher, and the game, bet types and lines are allowed.
 */
export function checkVoucher(
	voucher: Voucher,
	bets: { stake: number; numberOfLines: number; betType: { betTypeID: number } }[],
	game: { templateGameId: number; gameName: string } | null,
	gameName: (id: number) => string | undefined,
	betTypeName: (id: number) => string | undefined
): VoucherCheck {
	const total = bets.reduce((sum, bet) => sum + (Number(bet.stake) || 0), 0);
	const checks: { label: string; ok: boolean }[] = [];
	checks.push(
		total <= voucher.amount
			? { label: `Stake ${naira(total)}, within the ${naira(voucher.amount)} free ticket`, ok: true }
			: { label: `Stake ${naira(total)} is over ${naira(voucher.amount)}. Lower it to ${naira(voucher.amount)} or less`, ok: false }
	);
	if (voucher.allowedGameIds?.length) {
		const allowed = !!game && voucher.allowedGameIds.includes(game.templateGameId);
		const names = voucher.allowedGameIds.map(gameName).filter(Boolean).join(', ');
		checks.push({ label: allowed ? `Allowed on ${game?.gameName}` : `Only for ${names || 'selected games'}`, ok: allowed });
	}
	if (voucher.excludedBetTypeIds?.length) {
		const bad = bets.filter((b) => voucher.excludedBetTypeIds.includes(b.betType.betTypeID));
		checks.push(
			bad.length
				? { label: `Not for ${[...new Set(bad.map((b) => betTypeName(b.betType.betTypeID) || 'this bet type'))].join(', ')}`, ok: false }
				: { label: 'Bet types allowed', ok: true }
		);
	}
	if (voucher.maxLines) {
		const tooMany = bets.some((b) => b.numberOfLines > (voucher.maxLines ?? 0));
		checks.push({ label: tooMany ? `Each bet can have at most ${voucher.maxLines} ${plural(voucher.maxLines, 'line', 'lines')}` : `Within ${voucher.maxLines} ${plural(voucher.maxLines, 'line', 'lines')}`, ok: !tooMany });
	}
	return { ok: checks.every((c) => c.ok), total, checks };
}
