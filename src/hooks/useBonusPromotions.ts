import { useQuery } from '@tanstack/react-query';
import { fetchBonusPromotions, type BonusPromotion } from '@/services/PromotionService';

// The bonuses on the website. Never throws to the page: without them the section is simply left out.
export const useBonusPromotions = () =>
	useQuery<BonusPromotion[], Error>({
		queryKey: ['bonusPromotions'],
		queryFn: fetchBonusPromotions,
		staleTime: 60 * 1000,
		retry: 1,
	});
