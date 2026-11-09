import apiClient from '@/utils/apiClient';

export interface BonusPromotionImage {
	url: string;
	width: number;
	height: number;
	alt?: string | null;
}

/** Where a signed-in customer stands on a bonus (Bonus/My) */
export type BonusStatus = 'Claimable' | 'InProgress' | 'Pending' | 'Earned' | 'Done' | 'SoldOut' | 'Locked' | 'Waiting';

export interface BonusCustomerStatus {
	status: BonusStatus;
	/** Tickets so far, or naira deposited (this round), or naira deposited in all for a claim */
	progress: number;
	target: number;
	earnedThisRound: number;
}

// A bonus as the website shows it: the back office's words and pictures, when it is on, and plainly what to do
// and what you get. BonusPromotion/Live for everyone; Bonus/My adds `mine` for a signed-in customer.
export interface BonusPromotion {
	id: number;
	headline: string;
	text?: string | null;
	when?: string | null;
	buttonLabel?: string | null;
	buttonLink?: string | null;
	images: BonusPromotionImage[];
	onNow: boolean;
	nextOn?: string | null;
	endsAt: string;
	/** No end date: it runs until it is switched off, so endsAt (31 Dec 2099) is not shown */
	ongoing?: boolean;
	/** For Play: only these tickets count, 1 = 5/90 tickets, 2 = accumulators; empty for any */
	onlyTicketType?: number | null;
	/** The free ticket pays for this kind of ticket only: 1 = 5/90, 2 = accumulator; empty for either */
	freeTicketType?: number | null;

	/** "Play" (tickets), "Deposit", "Claim", or "Signup" (given when a new player signs up with a qualifying code) */
	kind?: 'Play' | 'Deposit' | 'Claim' | 'Signup' | null;
	/** For Signup: any referrer's code qualifies (else only codes the back office chose) */
	anyReferralCode?: boolean;
	/** For Play: T (any ticket), W (won), L (lost) */
	ticketKind?: 'T' | 'W' | 'L' | null;
	ticketCount?: number | null;
	minStake?: number | null;
	streak?: boolean;
	depositAmount?: number | null;
	minimumDeposited?: number | null;
	repeatable?: boolean;
	maxPerCustomer?: number | null;
	scheduled?: boolean;
	roundEndsAt?: string | null;
	rewardAmount?: number;
	freeTickets?: number;
	validDays?: number | null;
	voucherExpiresAt?: string | null;
	maxWinAmount?: number | null;

	mine?: BonusCustomerStatus | null;
}

export const fetchBonusPromotions = async (): Promise<BonusPromotion[]> => {
	const res = await apiClient.get<BonusPromotion[]>('BonusPromotion/Live');
	return Array.isArray(res.data) ? res.data : [];
};
