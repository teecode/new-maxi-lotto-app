/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateUUID } from '@/lib/utils';
import type { dataApiResponse, LatestDrawTicketResponse } from '@/types/api';
import type {
	BetType,
	Game,
	GameResultType,
	GameTicket,
	WinnerTicket,
} from '@/types/game';
import apiClient from '@/utils/apiClient';

interface GameTicketsResponse extends dataApiResponse {
	data: GameTicket[];
}

interface GameResultResponse extends dataApiResponse {
	data: GameResultType[];
}

// {{base_url}}/api/user/my/earnings
// {{base_url}}/api/user/my/earnings
export const fetchBetTypes = async (gameType?: number): Promise<BetType[]> => {
	try {
        const url = gameType ? `v1/betType/byGameType/${gameType}` : 'v1/betType';
		const response = await apiClient.get<BetType[]>(url);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.message || 'Failed to fetch bet types.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchDailyGames = async (): Promise<Game[]> => {
	try {
		// v1 / dailygame / get;
		const response = await apiClient.get<Game[]>('v1/dailygame/get');
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.message || 'Failed to fetch daily games.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchLatestDraw = async (): Promise<
	LatestDrawTicketResponse[]
> => {
	try {
		// v1 / dailygame / get;
		const response = await apiClient.get<LatestDrawTicketResponse[]>(
			'DailyGameResult/RecentGameResult/4'
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.message || 'Failed to fetch latest draw.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const placeBet = async (
	payload: {
		customerID: number;
		dailyGameId: number;
        ticketType?: number; // Added ticketType
	},
	betSlips: any
) => {
	try {
		// v1 / dailygame / get;
		const response = await apiClient.post<GameTicket>('Ticket', {
			...payload,
			betslips: betSlips,
			requestId: generateUUID(), // generate a random string for requestId,
			regMethod: 1,
			vouchersEarnedId: 0,
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to place bet. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchGameTicketById = async (id: number): Promise<GameTicket> => {
	try {
		// v1 / dailygame / get;
		const response = await apiClient.get<GameTicket>(`Ticket/byid/${id}`);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to fetch game ticket. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchUserTickets = async (pagination: {
	pageSize: number;
	pageIndex: number;
	startDate?: string;
	endDate?: string;
}): Promise<GameTicketsResponse> => {
	console.log('pagination', pagination);

	try {
		const response = await apiClient.get<GameTicketsResponse>('Ticket', {
			params: {
				pageSize: pagination.pageSize,
				page: pagination.pageIndex + 1,
				// don't add start and end date if null
				startDate: pagination.startDate ? pagination.startDate : undefined,
				endDate: pagination.endDate ? pagination.endDate : undefined,
			},
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to fetch game ticket. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchGameResults = async (pagination: {
	pageSize: number;
	pageIndex: number;
	startDate?: string;
	endDate?: string;
	gameId?: number;
}): Promise<GameResultResponse> => {
	try {
		const response = await apiClient.get<GameResultResponse>(
			'DailyGameResult/AllGamesPerPeriodPerGame',
			{
				params: {
					pageSize: pagination.pageSize,
					page: pagination.pageIndex + 1,
					// don't add start and end date if null
					startDate: pagination.startDate ? pagination.startDate : undefined,
					endDate: pagination.endDate ? pagination.endDate : undefined,
					gameId: pagination.gameId ? pagination.gameId : undefined,
				},
			}
		);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to fetch game results. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchLastFourWinner = async (): Promise<WinnerTicket[]> => {
	try {
		const response = await apiClient.get<WinnerTicket[]>(
			'/Ticket/LatestWon?count=4'
		);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to fetch game results. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchTicketById = async (id: number): Promise<GameTicket> => {
	try {
		const response = await apiClient.get<GameTicket>(
			`Ticket/byid/${id}`
		);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to fetch ticket. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchBlockingRules = async (): Promise<
	import('@/types/game').BettingRulesConfig
> => {
	try {
		const response = await apiClient.get<
			import('@/types/game').BettingRulesConfig
		>('v1/betType/blocking-rules');
		return response.data;
	} catch (error: any) {
		console.error('Failed to fetch blocking rules', error);
		return { groups: [] };
	}
};
