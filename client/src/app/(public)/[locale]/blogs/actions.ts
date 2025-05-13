'use server';
import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import { rateLimitByKey } from '@/lib/limiter';
import {
	toggleBookmarkBlogService,
	toggleHeartBlogService
} from '@/service/blog';
import { RateLimitError } from '@/lib/errors';
import { revalidatePath } from 'next/cache';
export const toggleBookmarkBlogAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			blogId: z.string()
		})
	)
	.handler(async ({ input, ctx }) => {
		const { user } = ctx;
		try {
			await rateLimitByKey({
				key: `${user.id}-toggle-bookmark`,
				limit: 5,
				window: 60000 // 1 minute
			});

			const result = await toggleBookmarkBlogService(
				user.accessToken,
				input.blogId
			);
			revalidatePath(`/`);
			return result;
		} catch (error) {
			if (error instanceof RateLimitError) {
				throw new Error('Rate limit exceeded. Please try again later.');
			}
			throw error;
		}
	});

export const toggleHeartBlogAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			blogId: z.string()
		})
	)
	.handler(async ({ input, ctx }) => {
		const { user } = ctx;
		try {
			await rateLimitByKey({
				key: `${user.id}-toggle-heart`,
				limit: 10,
				window: 60000 // 1 minute
			});

			const result = await toggleHeartBlogService(
				user.accessToken,
				input.blogId
			);
			revalidatePath(`/`);
			revalidatePath(`/blog/${input.blogId}`);
			return result;
		} catch (error) {
			if (error instanceof RateLimitError) {
				throw new Error('Rate limit exceeded. Please try again later.');
			}
			throw error;
		}
	});
