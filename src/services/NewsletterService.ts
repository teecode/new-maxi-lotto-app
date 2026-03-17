/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/utils/apiClient';

export interface NewsletterCategory {
	id: number;
	name: string;
	code: string;
	description: string;
}

export interface NewsletterSubscription {
	email: string;
	dateSubscribed: string;
	categories: NewsletterCategory[];
}

export const fetchNewsletterCategories = async (): Promise<NewsletterCategory[]> => {
	try {
		const response = await apiClient.get<NewsletterCategory[]>('Newsletter/categories');
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to fetch newsletter categories.');
		}
		throw new Error('Network error, please try again.');
	}
};

export const subscribeToNewsletter = async (email: string, categoryCodes: string[]): Promise<any> => {
	try {
		const response = await apiClient.post('Newsletter/subscribe', {
			email,
			categoryCodes,
		});
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to subscribe to newsletter.');
		}
		throw new Error('Network error, please try again.');
	}
};

export const fetchMyNewsletterSubscription = async (email?: string): Promise<NewsletterSubscription> => {
	try {
		const response = await apiClient.get<NewsletterSubscription>('Newsletter/my-subscription', {
			params: { email }
		});
		return response.data;
	} catch (error: any) {
		if (error.response && error.response.data) {
			throw new Error(error.response.data.error || 'Failed to fetch newsletter subscription.');
		}
		throw new Error('Network error, please try again.');
	}
};
