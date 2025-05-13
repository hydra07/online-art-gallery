'use strict';
import * as z from 'zod';

const signInSchema = z
	.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		phone: z.string().min(10, 'Phone number must be at least 10 digits'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

const loginSchema = z.object({
	phone: z.string().min(10, 'Phone number must be at least 10 digits'),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

export { loginSchema, signInSchema };
