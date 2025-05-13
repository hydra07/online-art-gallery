import { GetPublicExhibitionsResponse } from "@/types/exhibition";
import { getPublicExhibitions } from "./exhibition";
import { ApiResponse } from "@/types/response";
import { createApi } from "@/lib/axios";
import { handleApiError } from "@/utils/error-handler";
import { Artwork } from "@/types/marketplace";
import { Blog } from "@/types/blog";
import { Artist } from "@/app/(public)/[locale]/home/@spotlight/components/artist-spotlight";
import { fetchArtPiecesByRange } from "@/app/(public)/[locale]/artworks/api";
import { TrendingArtist } from "@/app/(public)/[locale]/home/@trending/page";

interface User {
    name?: string;
    email: string;
    image?: string;
    phone: string;
}

export async function getTrendingExhibitions(): Promise<ApiResponse<GetPublicExhibitionsResponse>> {
    const response = await getPublicExhibitions({
        sort: { 'result.visits': -1 },
        limit: 5
    });
    return response;
}

export async function getNewExhibitions(): Promise<ApiResponse<GetPublicExhibitionsResponse>> {
    const response = await getPublicExhibitions({
        sort: { createdAt: -1 },
        limit: 10
    });
    return response;
}

export async function getFeaturedExhibitions(limit: number): Promise<ApiResponse<GetPublicExhibitionsResponse>> {
    const response = await getPublicExhibitions({
        filter: { isFeatured: true },
        sort: { createdAt: -1 },
        limit
    });
    return response;
}

//most view artist ??
export async function getFeaturedArtist(): Promise<ApiResponse<{
    artist: Artist
}>> {
    try {
        const res = await createApi().get('/artist/featured');
        return res.data;
    } catch (error) {
        console.error('Failed to fetch featured artist:', error);
        throw handleApiError<{ artist: User }>(error, 'Failed to fetch featured artist');
    }
}


export async function getNewRecommendedArtworks() {
    try {
        const res = await fetchArtPiecesByRange(0, 9, {
            status: ['available', 'selling'],
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        return res.data;
    } catch (error) {   
        console.error('Failed to fetch new recommended artworks:', error);
        throw handleApiError<{ artworks: Artwork[] }>(error, 'Failed to fetch new recommended artworks');
    }
}

export async function getFollowingArtworks(accessToken: string): Promise<ApiResponse<{
    artworks: Artwork[],
}>> {
    try {
       
        const res = await createApi(accessToken).get('/artwork/recommendations/following');
        return res.data;
    } catch (error) {
        console.error('Failed to fetch following artworks:', error);
        throw handleApiError<{ artworks: Artwork[] }>(error, 'Failed to fetch following artworks');
    }
}

//7 cai
export async function getMostHeartedBlogs(): Promise<ApiResponse<{
    blogs: Blog[],
}>> {
    try {
        const res = await createApi().get('/blog/most-hearted');
        return res.data;
    } catch (error) {
        console.error('Failed to fetch most hearted blogs:', error);
        throw handleApiError<{ blogs: Blog[] }>(error, 'Failed to fetch most hearted blogs');
    }
}

export async function getLatestArticles(): Promise<ApiResponse<{
    blogs: Blog[],
}>> {
    try {
        const res = await createApi().get('/blog/latest');
        return res.data;
    } catch (error) {
        console.error('Failed to fetch latest articles:', error);
        throw handleApiError<{ blogs: Blog[] }>(error, 'Failed to fetch latest articles');
    }
}

export async function getTrendingArtists(): Promise<ApiResponse<{
    artists: TrendingArtist[],
}>> {
    try {
        const res = await createApi().get('/artist/trending');
        return res.data;
    } catch (error) {
        console.error('Failed to fetch trending artists:', error);
        throw handleApiError<{ artists: Artist[] }>(error, 'Failed to fetch trending artists');
    }
}