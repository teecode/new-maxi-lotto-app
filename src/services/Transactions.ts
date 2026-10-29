/* eslint-disable @typescript-eslint/no-explicit-any */
import type { dataApiResponse } from '@/types/api';
import type { CustomerPayout, Transaction } from '@/types/transaction';
import apiClient from '@/utils/apiClient';

interface TransactionsResponse extends dataApiResponse {
	data: Transaction[];
}

interface PayoutResponse extends dataApiResponse {
	data: CustomerPayout[];
}
export const fetchTransactions = async (filters: {
	startDate?: string;
	endDate?: string;
	isPaid?: boolean;
	customer?: number;
}): Promise<Transaction[]> => {
	try {
		// /api/Paemnsty / Transactions;
		const response = await apiClient.get<Transaction[]>(
			'Payments/Transactions',
			{
				params: filters,
			}
		);
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

export const fetchUserTransactions = async (pagination: {
	pageSize: number;
	pageIndex: number;
	startDate?: string;
	endDate?: string;
}): Promise<TransactionsResponse> => {
	try {
		const response = await apiClient.get<TransactionsResponse>(
			'Payments/Transactions',
			{
				params: {
					pageSize: pagination.pageSize,
					page: pagination.pageIndex + 1,
					// don't add start and end date if null
					startDate: pagination.startDate ? pagination.startDate : undefined,
					endDate: pagination.endDate ? pagination.endDate : undefined,
				},
			}
		);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to fetch transactions. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};
// Request Withdrawal
export const requestWithdrawal = async (
	amount: number,
	customer?: number,
	details?: string
): Promise<any> => {
	try {
		const response = await apiClient.post('Payments/Payout', {
			amount,
			customer,
			details: details || '',
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			const data = error.response.data;
			let errorMessage = 'Failed to request withdrawal.';
			if (typeof data === 'string') {
				errorMessage = data;
			} else if (typeof data === 'object' && data !== null) {
				if (data.messages && Array.isArray(data.messages)) {
					errorMessage = data.messages.join(', ');
				} else if (data.Messages && Array.isArray(data.Messages)) {
					errorMessage = data.Messages.join(', ');
				} else {
					errorMessage = JSON.stringify(data);
				}
			}
			throw new Error(errorMessage);
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const fetchUserPayouts = async (pagination: {
	pageSize: number;
	pageIndex: number;
	startDate?: string;
	endDate?: string;
}): Promise<PayoutResponse> => {
	try {
		const response = await apiClient.get<PayoutResponse>('Payments/Payouts', {
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
				error.response.data || 'Failed to fetch payouts. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchPayoutById = async (id: number): Promise<CustomerPayout> => {
	try {
		const response = await apiClient.get<CustomerPayout>(
			`Payments/Payouts/${id}`
		);
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to fetch payout. Please try again.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};
