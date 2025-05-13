'use server';

import { z } from 'zod';
import { authenticatedAction } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { updateExhibition } from '@/service/exhibition';
import { ExhibitionStatus } from '@/types/exhibition';

// Define validation schema
const updateLinkNameFormSchema = z.object({
    id: z.string(),
    linkName: z.string()
        .min(3, { message: 'Link name must be at least 3 characters long' })
        .max(30, { message: 'Link name must be less than 30 characters' })
        .regex(/^[a-z0-9-]+$/, {
            message: 'Link name can only contain lowercase letters, numbers, and hyphens'
        }),
});

export const publishExhibitionAction = authenticatedAction
    .createServerAction()
    .input(updateLinkNameFormSchema)
    .handler(async ({ input, ctx }) => {
        const { id, linkName } = input;
        // Set status to PUBLISHED when publishing
        const result = await updateExhibition(ctx.user.accessToken, id, { 
            linkName,
            status: ExhibitionStatus.PUBLISHED 
        });
        revalidatePath(`/creator/${id}`);
        revalidatePath(`/creator/${id}/public`);
        return result.data;
    });

export const unpublishExhibitionAction = authenticatedAction
    .createServerAction()
    .input(z.object({
        id: z.string()
    }))
    .handler(async ({ input, ctx }) => {
        const { id } = input;
        // Set status to DRAFT when unpublishing
        const result = await updateExhibition(ctx.user.accessToken, id, { 
            status: ExhibitionStatus.DRAFT
        });
        revalidatePath(`/creator/${id}`);
        revalidatePath(`/creator/${id}/public`);
        return result.data;
    });

export const updateDiscoveryAction = authenticatedAction
    .createServerAction()
    .input(z.object({
        id: z.string(),
        isDiscoverable: z.boolean()
    }))
    .handler(async ({ input, ctx }) => {
        const { id, isDiscoverable } = input;
        const result = await updateExhibition(ctx.user.accessToken, id, { discovery: isDiscoverable });
        revalidatePath(`/creator/${id}`);
        revalidatePath(`/creator/${id}/public`);
        return result.data;
    });