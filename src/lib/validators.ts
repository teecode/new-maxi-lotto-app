import z from 'zod';

export const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const signupSchema = z
	.object({
		username: z.string().min(1, 'Username is required'),
		phoneNumber: z.string().min(1, 'Phone number is required'),
		email: z.string().email('Invalid email'),
		terms: z.boolean().refine((val) => val, {
			message: 'You must accept the terms and conditions',
		}),
		ageConsent: z.boolean().refine((val) => val, {
			message: 'You must be above 18 years',
		}),
		password: z.string().min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z
			.string()
			.min(6, 'Confirm password must be at least 6 characters long'),
		referralCode: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
	});

export const forgotPasswordSchema = z
	.object({
		email: z.string().min(1, 'Email is required'),
	})
	.refine((data) => data.email.includes('@'), {
		message: 'Please enter a valid email address',
	});
