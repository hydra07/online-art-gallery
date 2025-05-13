'use server';

import { adminOnlyAction } from '@/lib/safe-action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { deleteGalleryTemplate, updateGalleryStatus } from '@/service/gallery-service';

export const deleteGalleryTemplateAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    id: z.string()
  }))
  .handler(async ({ input: { id }, ctx }) => {
    try {
      await deleteGalleryTemplate(ctx.user.accessToken, id);
      revalidatePath('/gallery');
      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery template:', error);
      throw new Error('Failed to delete gallery template');
    }
  });

export const toggleGalleryStatusAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    id: z.string(),
    isActive: z.boolean()
  }))
  .handler(async ({ input: { id, isActive }, ctx }) => {
    try {
      await updateGalleryStatus(ctx.user.accessToken, id, isActive);
      revalidatePath('/gallery');
      return { success: true };
    } catch (error) {
      console.error('Error updating gallery status:', error);
      throw new Error('Failed to update gallery status');
    }
  });