import apiClient from '@/utils/apiClient';
import type { BonusPromotion } from './PromotionService';

// A free-ticket voucher a customer has earned (Bonus/GetUnusedEarnedVouchers). One voucher pays for
// `freeTicketsNumber` tickets, each staking up to `amount`; the wallet is not charged.
export interface Voucher {
	id: string;
	name?: string | null;
	displayName?: string | null;
	displayMessage?: string | null;
	amount: number;
	freeTicketsNumber: number;
	usedTicketsNumber: number;
	expirationDate?: string | null;
	earnedAt?: string | null;
	voucherBonusId?: number;
	/** The most a ticket played with it can win, when capped */
	maxWinAmount?: number | null;
	/** The most lines a bet may have */
	maxLines?: number | null;
	/** The games it can be used on (template game ids); empty for any game */
	allowedGameIds: number[];
	/** Bet types it cannot be used on */
	excludedBetTypeIds: number[];
}

// The API answers errors with a sentence (or a list of them); show that, not a status code
const reason = (error: any, fallback: string): string => {
	const data = error?.response?.data;
	if (typeof data === 'string' && data.trim()) return data;
	if (Array.isArray(data) && data.length) return String(data[0]);
	if (data?.message) return data.message;
	return error?.response ? fallback : 'Network error. Check your connection and try again.';
};

/** The bonuses on the website and every bonus the customer can claim, each with where they stand */
export const fetchMyBonuses = async (): Promise<BonusPromotion[]> => {
	const res = await apiClient.get<BonusPromotion[]>('Bonus/My');
	return Array.isArray(res.data) ? res.data : [];
};

/** Vouchers the customer can still play, soonest to expire first */
export const fetchMyVouchers = async (): Promise<Voucher[]> => {
	const res = await apiClient.get<Voucher[]>('Bonus/GetUnusedEarnedVouchers');
	const list = Array.isArray(res.data) ? res.data : [];
	return list.sort((a, b) => new Date(a.expirationDate ?? 0).getTime() - new Date(b.expirationDate ?? 0).getTime());
};

/** Every voucher the customer has had, used and expired included, newest first */
export const fetchVoucherHistory = async (): Promise<Voucher[]> => {
	const res = await apiClient.get<Voucher[]>('Bonus/GetAllEarnedVouchers');
	const list = Array.isArray(res.data) ? res.data : [];
	return list.sort((a, b) => new Date(b.earnedAt ?? 0).getTime() - new Date(a.earnedAt ?? 0).getTime());
};

/** Claims a bonus that is claimed rather than earned; throws with the reason when it cannot be */
export const claimBonus = async (bonusId: number): Promise<Voucher> => {
	try {
		const res = await apiClient.post<Voucher>('Bonus/ClaimAvailableDailyBonus', null, { params: { VoucherBonusId: bonusId } });
		return res.data;
	} catch (error: any) {
		throw new Error(reason(error, 'The free ticket could not be claimed. Please try again.'));
	}
};

// ---------- notifications ----------

export interface CustomerNotification {
	id: number;
	title?: string | null;
	message?: string | null;
	expirationDate: string;
	isRead: boolean;
	customerId: number;
	/** NEW_VOUCHER links to the customer's free tickets */
	code?: string | null;
}

/** The latest notifications, read or not */
export const fetchNotifications = async (): Promise<CustomerNotification[]> => {
	const res = await apiClient.get<CustomerNotification[]>('Notification/GetNotifications', { params: { onlyUnreadAndNew: false } });
	return Array.isArray(res.data) ? res.data : [];
};

export const markNotificationRead = async (id: number) => {
	await apiClient.post('Notification/MarkNotificationAsRead', null, { params: { CustomerNotificationId: id } });
};

export const markAllNotificationsRead = async () => {
	await apiClient.post('Notification/MarkAllNotificationsAsRead');
};
