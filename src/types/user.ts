import { Wallet } from 'lucide-react';
export type User = {
	customerId: number;
	username: string;
	displayName: string;
	lastname: string | null;
	firstname: string | null;
	middlename: string | null;
	token: string;
	isVerified: boolean;
	isActive: boolean;
	email: string;
	phoneNumber: string;
	customerType: number;
	dateRegistered: string; // keep as string or change to Date
	wallet: Wallet;
	printingOptionsNumber: number | null;
	androidAPKVersionCode: number | null;
	isDeviceLocationTrackingEnabled: boolean;
	terminalId: string | null;
	shopId: string | null;
	shopName: string | null;
	walletBalance: number;
	walletPayoutBalance: number;
	sex: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	country: string | null;
	postalCode: string | null;
	dateOfBirth: Date | null; // keep as string or change to Date
	mobile: string | null;
	skype: string | null;
	bbmPin: string | null;
	subscribedSMS: boolean;
	subscribedMail: boolean;
	accountName: string | null;
	accountNumber: string | null;
	accountType: string | null;
	bank: number | null;
	rank: string;
};

export type MinimalUser = {
	customerId: number;
	username: string;
	displayName: string;
	email: string;
	phoneNumber: string;
	token: string;
	isVerified: boolean;
	isActive: boolean;
	walletBalance: number;
};

export type Wallet = {
	walletBalance: number;
	winningBalance: number;
};

export type Bank = {
	code: string;
	id: string;
	name: string;
};
export interface DebitCard {
	id: number;
	name?: string;
	bankName?: string;
	accountNumber?: string;
	accountName?: string;
	type: string;
	title: string;
	status: number;
	detail: string;
	instance: string;
	additionalProp1?: string;
	additionalProp2?: string;
	additionalProp3?: string;
}

export interface FavouriteBalls {
	balls: number[];
}
