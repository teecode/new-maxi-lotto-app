/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DepositResponse } from '@/types/api';
import apiClient from '@/utils/apiClient';

interface verifyResponseProps {
	statusCode: boolean;
	reference: string;
}
export const depositFunds = async (
	customerId: number,
	amount: number,
	paymentProvider?: string,
	bankId?: number
): Promise<DepositResponse> => {
	try {
		// /api/Payments/paystack/Deposit/Request
		const paymentProviderValue = paymentProvider || "Paystack"
		const response = await apiClient.post<DepositResponse>(
			'Payments/paystack/Deposit/Request',
			{
				customerId,
				amount,
				paymentProviderValue,
				bankId,
			}
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error || 'Deposit failed. Please try again.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};

// verify Deposit
// /api/Payments/paystack/verify/{reference}
export const verifyDeposit = async (reference: string): Promise<verifyResponseProps> => {
	try {
		const response = await apiClient.post<verifyResponseProps>(
			'Payments/paystack/verify/' + reference
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error ||
					'Deposit verification failed. Please try again.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};

// SarePay Endpoints

export const sarePayCharge = async (
	customerId: number,
	amount: number,
	encryptedCardData: string
): Promise<DepositResponse> => {
	try {
		const response = await apiClient.post<DepositResponse>('Payments/sarepay/charge', {
			depositRequest: {
				customerId,
				amount,
				paymentProvider: 'Sarepay', // Or map to enum appropriately
			},
			encryptedCardData,
		});
		return response.data;
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(error.response.data.error || error.response.data || 'SarePay charge failed.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const sarePaySubmitPin = async (
	customerId: number,
	amount: number,
	reference: string,
	encryptedPin: string
): Promise<DepositResponse> => {
	try {
		const response = await apiClient.post<DepositResponse>('Payments/sarepay/submit-pin', {
			depositRequest: {
				customerId,
				amount,
				paymentProvider: 'Sarepay',
			},
			reference,
			encryptedPin,
		});
		return response.data;
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(error.response.data.error || error.response.data || 'SarePay PIN submission failed.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const sarePaySubmitOtp = async (
	customerId: number,
	amount: number,
	reference: string,
	otp: string
): Promise<DepositResponse> => {
	try {
		const response = await apiClient.post<DepositResponse>('Payments/sarepay/submit-otp', {
			depositRequest: {
				customerId,
				amount,
				paymentProvider: 'Sarepay',
			},
			reference,
			otp,
		});
		return response.data;
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(error.response.data.error || error.response.data || 'SarePay OTP submission failed.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const verifySarepayDeposit = async (reference: string): Promise<verifyResponseProps> => {
	try {
		const response = await apiClient.post<verifyResponseProps>('Payments/sarepay/verify/' + reference);
		return response.data;
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(error.response.data.error || error.response.data || 'SarePay verification failed.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

export interface SarePayTransferResponse {
	account_number: string;
	account_name: string;
	bank: string;
	expires_at: string;
	reference: string;
	status: string;
}

export const requestSarePayTransfer = async (
	customerId: number,
	amount: number
): Promise<SarePayTransferResponse> => {
	try {
		const response = await apiClient.post<any>('Payments/sarepay/transfer/request', {
			customerId,
			amount,
		});
		return response.data?.data || response.data;
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(error.response.data.error || error.response.data.message || 'SarePay transfer request failed.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const verifySarePayTransfer = async (reference: string): Promise<any> => {
	try {
		const response = await apiClient.get<any>(`Payments/sarepay/transfer/status/${reference}`);
		return response.data?.data || response.data;
	} catch (error: any) {
		if (error.response?.data) {
			throw new Error(error.response.data.error || error.response.data.message || 'SarePay transfer verification failed.');
		}
		throw new Error('Network error, please check your connection.');
	}
};
