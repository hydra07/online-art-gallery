"use server";

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { approveArtistRequest, rejectArtistRequest, deleteArtistRequest } from "@/service/artist-request-service";

export const approveArtistRequestAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    requestId: z.string(),
  }))
  .handler(async ({ input: { requestId }, ctx }) => {
    await approveArtistRequest({
      accessToken: ctx.user.accessToken,
      requestId,
    });
    revalidatePath("/artist-requests");
  });

export const rejectArtistRequestAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    requestId: z.string(),
    reason: z.string(),
  }))
  .handler(async ({ input: { requestId, reason }, ctx }) => {
    await rejectArtistRequest({
      accessToken: ctx.user.accessToken,
      requestId,
      rejectionReason: reason,
    });
    revalidatePath("/artist-requests");
  });

export const deleteArtistRequestAction = adminOnlyAction
  .createServerAction()
  .input(z.object({
    requestId: z.string(),
  }))
  .handler(async ({ input: { requestId } }) => {
    await deleteArtistRequest(requestId);
    revalidatePath("/artist-requests");
  });