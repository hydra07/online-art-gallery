"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { approveExhibition, deleteExhibition, rejectExhibition, updateExhibition } from "@/service/exhibition-service";

export const deleteExhibitionAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string()
  }))
  .handler(async ({
    input: { exhibitionId },
    ctx: { },
  }) => {
    await deleteExhibition(exhibitionId);
    revalidatePath("/exhibitions");
  });

export const approveExhibitionAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string(),
  }))
  .handler(async ({ input: { exhibitionId }, ctx }) => {
    const _approvedExhibition = await approveExhibition({
      accessToken: ctx.user.accessToken,
      exhibitionId,
    });
    console.log("Exhibition approved:", _approvedExhibition);
    revalidatePath("/exhibitions");
  });

export const rejectExhibitionAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string(),
    reason: z.string(),
  }))
  .handler(async ({ input: { exhibitionId, reason }, ctx }) => {
    const _rejectedExhibition = await rejectExhibition({
      accessToken: ctx.user.accessToken,
      exhibitionId,
      reason,
    });
    console.log("Exhibition rejected:", _rejectedExhibition);
    revalidatePath("/exhibitions");
  });

export const toggleExhibitionFeaturedAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    exhibitionId: z.string(),
    isFeatured: z.boolean(),
  }))
  .handler(async ({ input: { exhibitionId, isFeatured }, ctx }) => {
    const _updatedExhibition = await updateExhibition({
      accessToken: ctx.user.accessToken,
      updateData: {
        _id: exhibitionId,
        isFeatured,
      }
    });
    console.log("Exhibition updated:", _updatedExhibition);
    revalidatePath("/exhibitions");
  });