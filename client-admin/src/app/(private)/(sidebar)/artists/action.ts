// app/(private)/(sidebar)/artists/action.ts
"use server"

import { adminOnlyAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { updateArtist } from "@/service/artist-service";

export const setArtistFeaturedAction = adminOnlyAction
    .createServerAction()
    .input(z.object({
        artistId: z.string(),
    }))
    .handler(async ({ input: { artistId }, ctx }) => {
        const _updatedArtist = await updateArtist({
            accessToken: ctx.user.accessToken,
            updateData: {
                _id: artistId
            }
        });
        console.log("Artist updated:", _updatedArtist);
        revalidatePath("/artists");
    });