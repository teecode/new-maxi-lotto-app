import apiClient from '@/utils/apiClient';

export interface BonusPromotionImage {
	url: string;
	width: number;
	height: number;
	alt?: string | null;
}

// A bonus the back office has put on the website (BonusPromotion/Live): running now or about to start
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
}

export const fetchBonusPromotions = async (): Promise<BonusPromotion[]> => {
	const res = await apiClient.get<BonusPromotion[]>('BonusPromotion/Live');
	return Array.isArray(res.data) ? res.data : [];
};
