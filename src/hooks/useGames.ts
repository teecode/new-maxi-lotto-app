import {
	fetchBetTypes,
	fetchDailyGames,
	fetchLastFourWinner,
	fetchLatestDraw,
    fetchBlockingRules,
} from '@/services/GameService';
import type { LatestDrawTicketResponse } from '@/types/api';
import type { BetType, Game, WinnerTicket } from '@/types/game';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

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

export const useFetchTopWinner = () => {
	return useSuspenseQuery<WinnerTicket[], Error>({
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
