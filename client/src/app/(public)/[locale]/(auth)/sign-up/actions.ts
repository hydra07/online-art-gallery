'use server';

// import { rateLimitByIp } from "@/lib/limiter";
import { unauthenticatedAction } from '@/lib/safe-action';
import { registerUser } from '@/service/user';
import { sendOtp } from '@/service/otp';
import {
	InvalidOtpError,
	RegistrationFailedError,
	UserAlreadyExistsError
} from '@/lib/errors';
import axiosInstance from 'axios';
import { z } from 'zod';
import { signOut } from 'next-auth/react';
import { getSession } from '@/lib/session';

export const sendOtpAction = unauthenticatedAction
	.createServerAction()
	.input(
		z.object({
			phone: z
				.string()
				.min(10)
				.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/)
		})
	)
	.handler(async ({ input }) => {
		try {
			// await rateLimitByIp({ key: "sendOtp", limit: 1, window: 60000 }); // 1 request per 60s
			const res = await sendOtp(input.phone);

			return res.status === 200;
		} catch (error) {
			if (axiosInstance.isAxiosError(error)) {
				if (error.response?.data.message === 'User already exists') {
					// TODO: change to error code or simple message
					throw new UserAlreadyExistsError();
				}
			}
			throw error;
		}
	});

export const signUpAction = unauthenticatedAction
	.createServerAction()
	.input(
		z.object({
			phone: z
				.string()
				.min(10)
				.regex(/^(0[3|5|7|8|9])+([0-9]{8})$/),
			name: z.string().min(2),
			password: z.string().min(8),
			otp: z.string().length(6)
		})
	)
	.handler(async ({ input }) => {
		// await rateLimitByIp({ key: "register", limit: 5, window: 60000 }); // 5 requests per 60s
		try {
			const res = await registerUser(
				input.name,
				input.phone,
				input.password,
				input.otp
			);
			return res;
		} catch (error) {
			console.log('error', error);
			if (axiosInstance.isAxiosError(error)) {
				if (error.response?.data.message === 'invalidOtp') {
					throw new InvalidOtpError();
				}
				if (
					error.response?.data.message ===
					'phoneNumberAlreadyRegistered'
				) {
					throw new UserAlreadyExistsError();
				}
				if (error.response?.data.message === 'registrationFailed') {
					throw new RegistrationFailedError();
				}
			}
			throw error;
		}
	});

export const signOutAction = async (): Promise<void> => {
	const session = await getSession();
	if (session) {
		await signOut({ redirect: true, callbackUrl: '/sign-in' });
	}
};
