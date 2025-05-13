'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authenticatedAction } from '@/lib/safe-action'
import { updateProfile } from './queries'

export async function revalidateProfilePages() {
    revalidatePath('/[locale]/settings/profile')
    revalidatePath('/[locale]/profile')
}

export const updateAvatarAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            url: z.string()
        })
    )
    .handler(async ({ input, ctx }) => {
        const response = await updateProfile({ image: input.url }, ctx.user.accessToken)

        // Revalidate the profile pages
        revalidatePath('/settings/profile')
        revalidatePath('/[locale]/settings/profile')

        return response.data
    })


export const updateArtistProfileAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            bio: z.string().min(1, { message: 'Bio is required' }),
            
        })
    )
    .handler(async ({ input, ctx }) => {
        const updatedProfile = await updateProfile({ artistProfile: { bio: input.bio } }, ctx.user.accessToken);

        revalidatePath('/settings/profile');
        return updatedProfile;
    });

    export const updateArtistGenresAction = authenticatedAction
    .createServerAction()
    .input(
        z.object({
            genre: z.array(z.string())
        })
    )
    .handler(async ({ input, ctx }) => {
        const updatedProfile = await updateProfile({ 
            artistProfile: { 
                genre: input.genre 
            } 
        }, ctx.user.accessToken);

        revalidatePath('/settings/profile');
        return updatedProfile;
    });



