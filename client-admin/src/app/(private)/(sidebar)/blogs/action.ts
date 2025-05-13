/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { approveBlog, deleteBlog, rejectBlog, updateBlog } from "@/service/blog-service";



export const updateBlogTagsAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    blogId: z.string(),
    tags: z.array(z.string()),
  }))
  .handler(async ({ input: { blogId, tags }, ctx }) => {
    // Implement your blog tag update logic here
    console.log("Updating tags for blog", blogId, tags);
    const updatedBlog = await updateBlog({
      accessToken: ctx.user.accessToken,
      updateData: {
        _id: blogId,
        tags,
      }
    });

    revalidatePath("/blogs");
  })


export const deleteBlogAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    blogId: z.string()
  }))

  .handler(async ({
    input: { blogId },

    ctx: { },
  }) => {
    await deleteBlog(blogId);
    revalidatePath("/blogs");
  });

export const approveBlogAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    blogId: z.string(),
  }))
  .handler(async ({ input: { blogId }, ctx }) => {
    const _approvedBlog = await approveBlog({
      accessToken: ctx.user.accessToken,
      blogId,
    });
    revalidatePath("/blogs");
  });

export const rejectBlogAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    blogId: z.string(),
    reason: z.string(),
  }))
  .handler(async ({ input: { blogId, reason }, ctx }) => {
    const _rejectedBlog = await rejectBlog({
      accessToken: ctx.user.accessToken,
      blogId,
      reason,
    });
    revalidatePath("/blogs");
  });


