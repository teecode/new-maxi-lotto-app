import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchBonusPromotions, type BonusPromotion } from '@/services/PromotionService';
import {
	claimBonus,
	fetchMyBonuses,
	fetchMyVouchers,
	fetchNotifications,
	fetchVoucherHistory,
	markAllNotificationsRead,
	markNotificationRead,
	type CustomerNotification,
	type Voucher,
} from '@/services/BonusService';
import useAuthStore from '@/store/authStore';
import { rewardText } from '@/lib/bonus-words';

// The bonuses on the website. Never throws to the page: without them the section is simply left out.
export const useBonusPromotions = () =>
	useQuery<BonusPromotion[], Error>({
		queryKey: ['bonusPromotions'],
		queryFn: fetchBonusPromotions,
		staleTime: 60 * 1000,
		retry: 1,
	});

const useCustomer = () => {
	const { isAuthenticated, minimalUser } = useAuthStore();
	return { signedIn: isAuthenticated && !!minimalUser?.customerId, customerId: minimalUser?.customerId ?? 0 };
};

/** The signed-in customer's bonuses with where they stand; refreshed every minute so progress moves */
export const useMyBonuses = () => {
	const { signedIn, customerId } = useCustomer();
	return useQuery<BonusPromotion[], Error>({
		queryKey: ['myBonuses', customerId],
		queryFn: fetchMyBonuses,
		enabled: signedIn,
		staleTime: 30 * 1000,
		refetchInterval: 60 * 1000,
		retry: 1,
	});
};

/**
 * What to show as bonus offers: the customer's own list (with progress and Claim) once signed in, else the open list.
 * `personal` says which it is.
 */
export const useBonusOffers = () => {
	const { signedIn } = useCustomer();
	const open = useBonusPromotions();
	const mine = useMyBonuses();
	const personal = signedIn && !!mine.data;
	return { offers: (personal ? mine.data : open.data) ?? [], personal, signedIn, loading: open.isLoading || (signedIn && mine.isLoading) };
};

export const useMyVouchers = () => {
	const { signedIn, customerId } = useCustomer();
	return useQuery<Voucher[], Error>({
		queryKey: ['myVouchers', customerId],
		queryFn: fetchMyVouchers,
		enabled: signedIn,
		staleTime: 30 * 1000,
		retry: 1,
	});
};

export const useVoucherHistory = (enabled = true) => {
	const { signedIn, customerId } = useCustomer();
	return useQuery<Voucher[], Error>({
		queryKey: ['voucherHistory', customerId],
		queryFn: fetchVoucherHistory,
		enabled: signedIn && enabled,
		staleTime: 60 * 1000,
	});
};

/** After anything that changes vouchers: a claim, a ticket played with one */
export const useRefreshBonuses = () => {
	const queryClient = useQueryClient();
	return () =>
		Promise.all(['myBonuses', 'myVouchers', 'voucherHistory', 'notifications'].map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
};

export const useClaimBonus = () => {
	const refresh = useRefreshBonuses();
	return useMutation<Voucher, Error, BonusPromotion>({
		mutationFn: (bonus) => claimBonus(bonus.id),
		onSuccess: async (voucher, bonus) => {
			toast.success(`Claimed! Your ${rewardText({ rewardAmount: voucher?.amount ?? bonus.rewardAmount, freeTickets: voucher?.freeTicketsNumber ?? bonus.freeTickets })} is ready to play.`);
			await refresh();
		},
		onError: async (error) => {
			toast.error(error.message);
			await refresh();
		},
	});
};

export const useNotifications = () => {
	const { signedIn, customerId } = useCustomer();
	return useQuery<CustomerNotification[], Error>({
		queryKey: ['notifications', customerId],
		queryFn: fetchNotifications,
		enabled: signedIn,
		staleTime: 30 * 1000,
		refetchInterval: 60 * 1000,
		retry: 1,
	});
};

export const useMarkNotifications = () => {
	const queryClient = useQueryClient();
	const { customerId } = useCustomer();
	const key = ['notifications', customerId];
	// Shown as read at once; the list catches up from the server after
	const markLocally = (ids: number[] | 'all') =>
		queryClient.setQueryData<CustomerNotification[]>(key, (list) => list?.map((n) => (ids === 'all' || ids.includes(n.id) ? { ...n, isRead: true } : n)));
	return {
		markOne: async (id: number) => {
			markLocally([id]);
			try { await markNotificationRead(id); } finally { queryClient.invalidateQueries({ queryKey: key }); }
		},
		markAll: async () => {
			markLocally('all');
			try { await markAllNotificationsRead(); } finally { queryClient.invalidateQueries({ queryKey: key }); }
		},
	};
};
