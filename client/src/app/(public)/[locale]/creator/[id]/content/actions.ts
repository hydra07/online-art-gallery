'use server';

import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import { updateExhibition } from '@/service/exhibition';
import { revalidatePath } from 'next/cache';
import { contentSchema } from '@/types/exhibition';

export const updateExhibitionContentAction = authenticatedAction
    .createServerAction()
    .input(z.object({
        id: z.string(),
        data: contentSchema,
    }))
    .handler(async ({ input, ctx }) => {
        const { id, data } = input;
        const payload = {
            ...(data.backgroundAudio && { backgroundAudio: data.backgroundAudio }),
            ...(data.welcomeImage && { welcomeImage: data.welcomeImage }),
            ...(data.backgroundMedia && { backgroundMedia: data.backgroundMedia }),
            ...(data.contents && { contents: data.contents }),
        };

        const result = await updateExhibition(ctx.user.accessToken, id, payload);

        revalidatePath(`/creator/${id}`);
        revalidatePath(`/creator/${id}/content`);

        return result.data;
    });