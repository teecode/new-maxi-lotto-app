/* eslint-disable @typescript-eslint/no-explicit-any */
import type { defaultApiResponse } from '@/types/api';
import type { Bank, User } from '@/types/user';
import apiClient from '@/utils/apiClient';

type ResolveAccountResponse = {
	account_name: string;
	account_number: string;
	bank_id: number;
};

interface FavouriteBallsResponse {
	balls: number[];
	customerId: number;
}

export const fetchUserProfile = async (): Promise<User> => {
	try {
		const response = await apiClient.get<User>('User/Me');
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error || 'Failed to fetch user profile.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

// /api/Uers / UpdatePassword;
export const updatePassword = async (
	oldPassword: string,
	newPassword: string
): Promise<defaultApiResponse> => {
	try {
		const response = await apiClient.put<defaultApiResponse>(
			'User/UpdatePassword',
			{ oldPassword, newPassword }
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error || 'Failed to update password.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

export const updateUser = async (user: User): Promise<User> => {
	try {
		const response = await apiClient.post<User>('User/UpdateAccount', {
			...user,
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data || 'Failed to update profile.');
		}
		throw new Error('Network error, please try again.');
	}
};

/* Fetch banks */
export const fetchBanks = async (): Promise<Bank[]> => {
	try {
		const response = await apiClient.get<Bank[]>('Bank/get', {
			params: {
				CoralPayBanks: false,
			},
		});
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to fetch banks.');
		}
		throw new Error('Network error, please try again.');
	}
};

/* Resolve bank account number */
export const resolveAccountDetails = async (
	accountNumber: string,
	bankId: number
): Promise<ResolveAccountResponse> => {
	try {
		const response = await apiClient.get<ResolveAccountResponse>(
			'Bank/resolve-bank-account',
			{
				params: { accountNumber, bankId },
			}
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to resolve banks.');
		}
		throw new Error('Network error, please try again.');
	}
};

export const updateBankDetails = async (
	id: number,
	accountName: string,
	accountNumber: string,
	bank: number
): Promise<User> => {
	try {
		const response = await apiClient.post<User>('User/update-bank-details', {
			id,
			accountName,
			accountNumber,
			bank,
		});
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to update profile.');
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchDebitCards = async (): Promise<any> => {
	try {
		const response = await apiClient.get<any>('/Card');
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to fetch banks.');
		}
		throw new Error('Network error, please try again.');
	}
};

export const verifyUserEmailToken = async (otp: string): Promise<any> => {
	try {
		const response = await apiClient.post('User/verify-email', {
			otp,
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(error.response.data || 'Failed to verify email.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const sendContactUsMessage = async (
	name: string,
	email: string,
	phoneNumber: string,
	message: string
): Promise<any> => {
	try {
		const response = await apiClient.post('Support', {
			name,
			email,
			phoneNumber,
			message,
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to send contact us message.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const fetchFavouriteBalls = async (): Promise<number[]> => {
	try {
		const response = await apiClient.get<FavouriteBallsResponse>(
			'/Ticket/favouriteball'
		);
		return response.data.balls;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error || 'Failed to fetch favourite balls.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};

// update favourite ball
export const updateFavouriteBall = async (
	customerID: number,
	balls: number[]
): Promise<any> => {
	try {
		const response = await apiClient.post<any>('/Ticket/favouriteball', {
			customerID,
			balls,
		});
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error || 'Failed to update favourite ball.'
			);
		}
		throw new Error('Network error, please try again.');
	}
};
export type Rank = {
	level: number;
	name: string;
	minWins: number;
	minAmount: number;
	color: string;
};

export const fetchRanks = async (): Promise<Rank[]> => {
	try {
		const response = await apiClient.get<Rank[]>('User/GetRanks');
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to fetch ranks.');
		}
		throw new Error('Network error, please try again.');
	}
};
