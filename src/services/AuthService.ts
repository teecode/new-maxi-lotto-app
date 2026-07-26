/* eslint-disable @typescript-eslint/no-explicit-any */
import type { defaultApiResponse } from '@/types/api';
import type { User } from '@/types/user';
import apiClient from '@/utils/apiClient';

export const registerUser = async (
	username: string,
	email: string,
	password: string,
	phoneNumber: string,
	referralCode?: string
): Promise<User> => {
	try {
		const response = await apiClient.post<User>('User/signup', {
			username,
			email,
			password,
			phoneNumber,
			referralCode,
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data.length
					? error.response.data[0]
					: 'Registration failed. Please try again.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};

export async function login(
	usernameOrEmail: string,
	password: string
): Promise<User> {
	try {
		const response = await apiClient.post<User>('authenticate', {
			usernameOrEmail,
			password,
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			// Extract error message from response
			console.log('error.response.data', error.response);

			throw new Error(error.response.data || 'An unexpected error occurred');
		}
		throw new Error('Network error, please try again');
	}
}

export const updatePushSubscription = async (
	customerId: number,
	endpointUrl: string
): Promise<any> => {
	try {
		const response = await apiClient.post('authenticate/UpdatePushNotificationsEndpoint', {
			customerId,
			endpointUrl,
		});
		return response.data;
	} catch (error: any) {
		console.error('Failed to update push subscription', error);
	}
};

export const requestForgotPassword = async (email: string): Promise<any> => {
	try {
		const response = await apiClient.post('User/ResetPassword', {
			email,
			details: '',
		});
		return response.data;
	} catch (error: any) {
		if (error.response) {
			throw new Error(
				error.response.data || 'Failed to send password reset request.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const resetForgotPassword = async (
	token: string,
	newPassword: string
): Promise<any> => {
	try {
		const response = await apiClient.post('auth/reset-password', {
			token,
			newPassword,
		});
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to reset password.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

export const verifyEmailToken = async (token: string): Promise<any> => {
	try {
		const response = await apiClient.post('auth/verify-email', {
			token,
		});
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to reset password.');
		}
		throw new Error('Network error, please check your connection.');
	}
};

// /api/aaceehintttu / Logout;
export const logout = async () => {
	try {
		const response = await apiClient.post<defaultApiResponse>(
			'authenticate/Logout'
		);
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			// Extract error message from response
			throw new Error(
				error.response.data.error || 'An unexpected error occurred'
			);
		}
		throw new Error('Network error, please try again');
	}
};

// /api/Uers / send - email - verification;
export const sendEmailVerification = async (): Promise<any> => {
	try {
		const response = await apiClient.post('User/send-email-verification');
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(
				error.response.data.error || 'Failed to send verification email.'
			);
		}
		throw new Error('Network error, please check your connection.');
	}
};
