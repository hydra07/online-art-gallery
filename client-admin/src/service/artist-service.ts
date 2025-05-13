// service/artist-service.ts
import { createApi } from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import { ApiResponse } from "@/types/response";
import { Artist, GetArtistsResponse } from "@/types/artist";
import { handleApiError } from "@/utils/error-handler";

export const getArtists = async ({
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    search,
}: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
}): Promise<ApiResponse<GetArtistsResponse>> => {
    try {
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", String(page));
        if (limit) queryParams.append("limit", String(limit));
        if (sort) queryParams.set('sort', JSON.stringify(sort));
        if (search) queryParams.set('search', search);

        const user = await getCurrentUser();
        if (!user) throw new Error("Authorization error");

        const url = `/artist${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await createApi(user.accessToken).get(url);
        return res.data;
    } catch (error) {
        console.error("Error fetching artists:", error);
        throw handleApiError(error, 'Error fetching artists');
    }
};

export const updateArtist = async ({
    accessToken,
    updateData
}: {
    accessToken: string;
    updateData: {
        _id: string;
    };
}): Promise<ApiResponse<Artist>> => {
    try {
        const res = await createApi(accessToken).patch(
            `/artist/featured/${updateData._id}`);
        return res.data;
    } catch (error) {
        console.error('Error updating artist:', error);
        throw handleApiError(error, 'Failed to update artist');
    }
};

export const getArtistById = async (artistId: string): Promise<{
        user: Artist;
}> => {
    try {
        const user = await getCurrentUser();
        if (!user) throw new Error("Authorization error");

        const res = await createApi(user.accessToken).get(`/user/profile/${artistId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching artist:", error);
        throw handleApiError(error, 'Error fetching artist details');
    }
};