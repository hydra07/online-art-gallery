'use server';

import { authenticatedAction } from '@/lib/safe-action';
import { deleteBlog } from '@/service/blog';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { deleteBlogUseCase } from "@/use-cases/blogs";
import { z } from 'zod';

export const deleteBlogAction = authenticatedAction
	.createServerAction()
	.input(
		z.object({
			blogId: z.string()
		})
	)
	.handler(async ({ input, ctx }) => {
		const blogId = input.blogId;
		const res = await deleteBlog(ctx.user.accessToken, blogId);
		revalidatePath('/my-blogs');
		redirect('/my-blogs');
	});
