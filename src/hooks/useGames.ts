import {
	fetchBetTypes,
	fetchDailyGames,
	fetchLastFourWinner,
	fetchLatestDraw,
    fetchBlockingRules,
} from '@/services/GameService';
import type { LatestDrawTicketResponse } from '@/types/api';
import type { BetType, Game, WinnerTicket } from '@/types/game';
import { useQuery } from '@tanstack/react-query';

export const useGetBetTypes = (gameType?: number) => {
	return useQuery<BetType[], Error>({
		queryKey: ['earnings', gameType], // include filters in queryKey
		queryFn: () => fetchBetTypes(gameType),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useFetchDailyGames = () => {
	return useQuery<Game[], Error>({
		queryKey: ['dailygames'], // include filters in queryKey
		queryFn: () => fetchDailyGames(),
	});
};

export const useFetchLatestDraw = () => {
	return useQuery<LatestDrawTicketResponse[], Error>({
		queryKey: ['latestDraw'], // include filters in queryKey
		queryFn: () => fetchLatestDraw(),
	});
};

// Not a suspense query: the home page is the only user, and suspending here
// left the whole page (hero, games, footer) blank until this one call came
// back, and an error page if it failed.
export const useFetchTopWinner = () => {
	return useQuery<WinnerTicket[], Error>({
		queryKey: ['topWinners'], // include filters in queryKey
		queryFn: fetchLastFourWinner,
	});
};

export const useGetBlockingRules = () => {
	return useQuery<import('@/types/game').BettingRulesConfig, Error>({
		queryKey: ['blockingRules'],
		queryFn: fetchBlockingRules,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
