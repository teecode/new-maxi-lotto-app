import {
	ArrowRightLeft,
	Circle,
	CreditCard,
	Gift,
	Handshake,
	LockIcon,
	Ticket,
	User,
	UserCog,
	Wallet,
} from 'lucide-react';

export const TOKEN_TYPE = 'Bearer ';
export const REQUEST_HEADER_AUTH_KEY = 'Authorization';
export const PERSIST_STORE_NAME = 'persist:root';

export const genderList = [
	{
		label: 'Male',
		value: 'male',
	},
	{
		label: 'Female',
		value: 'female',
	},
	{
		label: 'Other',
		value: 'other',
	},
];

/* payment methods */
export const paymentMethods = [
	{
		label: 'Paystack',
		value: 'paystack',
	},
];

export const ProfileSettingsOne = [
	{
		label: 'Deposit',
		route: '/deposit',
		icon: User,
	},
	{
		label: 'Transactions',
		route: '/transactions',
		icon: ArrowRightLeft,
	},
	{
		label: 'Wallet',
		route: '/wallet',
		icon: Wallet,
	},
	{
		label: 'Tickets',
		route: '/tickets',
		icon: Ticket,
	},
	{
		label: 'Payouts',
		route: '/payouts',
		icon: Handshake,
	},
];

export const ProfileSettingsTwo = [
	{
		label: 'Favourites Ball',
		route: '/favourite-balls',
		icon: Circle,
	},
	{
		label: 'Bank Details',
		route: '/settings/bank',
		icon: CreditCard,
	},
	{
		label: 'Account',
		route: '/settings/profile',
		icon: UserCog,
	},
	{
		label: 'Change Password',
		route: '/settings/change-password',
		icon: LockIcon,
	},
	{
		label: 'Referral Program',
		route: '/settings/referral',
		icon: Gift,
	},
];

export const gradients = [
	'bg-[linear-gradient(117deg,#0185b6,#5eac73,#ffee00)]',
	'bg-[linear-gradient(72deg,#0185b6,#00d49c)]',
	'bg-[linear-gradient(72deg,#0185b6,#ffee00)]',
	'bg-[linear-gradient(266deg,#00d49c,#ffeb4a)]',
];
