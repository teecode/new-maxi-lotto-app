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
		const response = await apiClient.post<User>('session', {
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

export const PUBLIC_VAPID_KEY =
	'BGvj-Zh9pfncTH6GQA1Vap73ptpEw1xhWkOR4lsrpVeYCH8QAfd2oV8iuWcPf2g0t1f3XRamjGbDf1RXRyjvxiI';

export function urlB64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export const updatePushSubscription = async (
	customerId: number,
	endpointUrl: string
): Promise<any> => {
	try {
		const response = await apiClient.post(
			'session/UpdatePushNotificationsEndpoint',
			{
				customerId,
				endpointUrl,
			}
		);
		return response.data;
	} catch (error: any) {
		console.error('Failed to update push subscription', error);
		throw error;
	}
};

export const syncPushSubscription = async (
	customerId: number
): Promise<any> => {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
		console.warn('Push messaging is not supported in this browser.');
		return null;
	}

	try {
		const registration = await navigator.serviceWorker.ready;
		let sub = await registration.pushManager.getSubscription();

		// If no subscription exists, create one if permissions allow
		if (!sub && Notification.permission !== 'denied') {
			let perm: NotificationPermission = Notification.permission;
			if (perm === 'default') {
				perm = await Notification.requestPermission();
			}
			if (perm === 'granted') {
				const applicationServerKey = urlB64ToUint8Array(PUBLIC_VAPID_KEY);
				sub = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
				});
			}
		}

		if (sub && customerId) {
			console.log('[PushSync] Syncing push subscription to backend for customerId:', customerId);
			return await updatePushSubscription(customerId, JSON.stringify(sub));
		}
	} catch (error) {
		console.error('[PushSync] Error syncing push subscription:', error);
	}
	return null;
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
			'session/Logout'
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
