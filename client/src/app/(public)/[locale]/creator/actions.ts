'use server';

import { authenticatedAction } from "@/lib/safe-action";
import { createExhibition } from "@/service/exhibition";
import { updateExhibition } from '@/service/exhibition';
import { updateExhibitionSchema } from "@/types/exhibition";
import { revalidatePath } from "next/cache";

import { z } from "zod";


export const createExhibitionAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            templateId: z.string(),
        })
    )
    .handler(async ({ input, ctx }) => {
        const { templateId } = input;
        const res = await createExhibition(ctx.user.accessToken, templateId);
        return res.data;
    });

export const uploadArtworkAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            exhibitionId: z.string(),
            artworkId: z.string(),
            positionIndex: z.number()
        })
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .handler(async ({ input, ctx }) => {
        // const { exhibitionId, artworkId, positionIndex } = input;
        // return res.data;
    });

export const updateExhibitionAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            id: z.string(),
            data: updateExhibitionSchema
        })
    )
    .handler(async ({ input, ctx }) => {
        const { id, data } = input;
        const result = await updateExhibition(ctx.user.accessToken, id, data);
        
        revalidatePath(`/creator/${id}`);
        revalidatePath(`/creator/${id}/artworks`);
        revalidatePath(`/creator/${id}/content`);
        revalidatePath(`/creator/${id}/settings`);
        revalidatePath(`/creator/${id}/preview`);
        revalidatePath(`/creator/${id}/publish`);
        revalidatePath(`/creator/${id}/result`);

        return result.data;
    });
