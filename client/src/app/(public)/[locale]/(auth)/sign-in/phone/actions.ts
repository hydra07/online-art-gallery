'use server';

// import { rateLimitByKey } from "@/lib/limiter";
import { unauthenticatedAction } from '@/lib/safe-action';
// import { setSession } from "@/lib/session";
// import { authenticate } from "@/service/auth-service";
import { z } from 'zod';
import { authenticate } from '@/service/auth-service';
import axiosInstance from 'axios';
import {
	AuthenticationError,
	PasswordIncorrectError,
	UserNotFoundError
} from '@/lib/errors';
export const signInAction = unauthenticatedAction
	.createServerAction()
	.input(
		z.object({
			phone: z.string().min(10),
			password: z.string().min(8)
		})
	)
	.handler(async ({ input }) => {
		try {
			const result = await authenticate(
				{ phone: input.phone, password: input.password },
				{ provider: 'phone' }
			);
			return result.isAuthenticated;
		} catch (error) {
			if (axiosInstance.isAxiosError(error)) {
				if (error.response?.data.message === 'userNotFound') {
					throw new UserNotFoundError();
				} else if (
					error.response?.data.message === 'passwordIncorrect'
				) {
					throw new PasswordIncorrectError();
				} else {
					throw new AuthenticationError();
				}
			}
			throw error;
		}
	});
