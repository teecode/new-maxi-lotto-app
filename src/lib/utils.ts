import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment'
import { gradients } from '@/constants';
/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'ngn',
		minimumFractionDigits: 2,
	}).format(amount);
};

export const toUpperCase = (str?: string) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export const makeFirstLetterUppercase = (str?: string) => {
	if (!str) return '';
	return str.charAt(0).toUpperCase();
};

// format date
export const formattedDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Parse the date (month/day format)
// const date = parse('2/20', 'M/d', new Date());
export const formatDateToMonthDay = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'numeric',
	});
};

// Helper function for combinations (nCr)

export const factorial = (n: number): number => {
	if (n <= 1) return 1;
	return n * factorial(n - 1);
};

export const combination = (n: number, r: number): number => {
	if (r > n) return 0;
	return Math.floor(factorial(n) / (factorial(r) * factorial(n - r)));
};

export const permutation = (n: number, r: number): number => {
	if (r > n) return 0;
	return Math.floor(factorial(n) / factorial(n - r));
};

export const generateUUID = () => {
	// Public Domain/MIT
	let d = new Date().getTime(); //Timestamp
	let d2 =
		(typeof performance !== 'undefined' &&
			performance.now &&
			performance.now() * 1000) ||
		0; //Time in microseconds since page-load or 0 if unsupported
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = Math.random() * 16; //random number between 0 and 16
		if (d > 0) {
			//Use timestamp until depleted
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else {
			//Use microseconds since page-load if supported
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	});
};
export const timeOnlyFormat = (gameTime: string) => {
	return moment(gameTime, 'YYYY-MM-DD h:mm:ss A').format('hh:mm A');
};

export const isGameClosed = (endGameTime: string) => {
	return moment(endGameTime, 'YYYY-MM-DD h:mm:ss A').isBefore(
		moment(new Date()).subtract(1, 'seconds')
	);
};

export const fullDateFormat = (date: string) => {
	return moment(date, 'YYYY-MM-DD h:mm:ss A').format('YYYY-MM-DD');
};

export const fullDateTimeFormat = (date: string) => {
	return moment(date, 'YYYY-MM-DD h:mm:ss A').format('YYYY-MM-DD HH:mm:ss');
};

export const timeFormat = (gameTime: string) => {
	return moment(gameTime, 'YYYY-MM-DD h:mm:ss A').format('hh:mm:ss A');
};

export const getRandomGradient = () => {
	const randomIndex = Math.floor(Math.random() * gradients.length);
	return gradients[randomIndex];
};

export const maskEmail = (email: string): string => {
	if (!email || !email.includes('@')) return email;

	const [name, domain] = email.split('@');
	const visible = name.slice(0, 2); // show first 2 chars
	const hidden = '*'.repeat(Math.max(3, name.length - 2));
	return `${visible}${hidden}@${domain}`;
};

export const maskAccountNumber = (accountNumber: string): string => {
	if (!accountNumber) return accountNumber;
	const clean = accountNumber.replace(/\s+/g, '');
	if (clean.length <= 4) return '*'.repeat(clean.length);
	return '*'.repeat(clean.length - 4) + clean.slice(-4);
};

export const getImageUrl = (name: string) => {
	const path = 'data:image/jpeg;base64,' + name;
	return name ? path : '/placeholder.png';
};

// const finalImagePath = image ? `/${image}` : '/placeholder.png';
export const finalImagePath = (image: string) =>
	image ? `/${image}` : '/placeholder.png';
