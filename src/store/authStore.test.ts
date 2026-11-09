import { describe, expect, it, vi } from 'vitest';

vi.mock('@/services/UserService', () => ({ fetchUserProfile: vi.fn() }));

import { fromProfile } from './authStore';
import type { MinimalUser } from '@/types/user';

// What sign-in stores
const signedIn: MinimalUser = {
	customerId: 1249,
	username: 'bonustaker',
	displayName: 'bonustaker',
	email: 'b@example.com',
	phoneNumber: '08000000000',
	token: 'jwt',
	isVerified: true,
	isActive: true,
	walletBalance: 0,
};

// What GET User/Me answers (CustomerResponse, camelCased)
const me = {
	id: 1249,
	username: 'bonustaker',
	email: 'b@example.com',
	mobile: '08000000000',
	walletBalance: 500,
	isActive: true,
	isVerified: true,
	referralCode: 'bonustaker',
};

describe('fromProfile', () => {
	it('keeps the customer id, which User/Me calls id', () => {
		expect(fromProfile(me, signedIn).customerId).toBe(1249);
		expect(fromProfile(me, null).customerId).toBe(1249);
	});

	it('takes the fresh balance and keeps what User/Me leaves out', () => {
		const user = fromProfile(me, signedIn);
		expect(user.walletBalance).toBe(500);
		expect(user.token).toBe('jwt');
		expect(user.displayName).toBe('bonustaker');
		expect(user.phoneNumber).toBe('08000000000');
	});

	it('still carries the other fields of the answer, as before', () => {
		expect((fromProfile(me, signedIn) as unknown as { referralCode: string }).referralCode).toBe('bonustaker');
	});

	it('repairs a stored user that already lost customerId', () => {
		const broken = { ...me } as unknown as MinimalUser;
		expect(fromProfile(me, broken).customerId).toBe(1249);
	});
});
