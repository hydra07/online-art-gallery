// import { createApi } from "@/lib/axios";

import { createApi } from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import { ExhibitionRequestResponse, GetExhibitionsResponse, GetPublicExhibitionsResponse, LikeArtworkResponse, TicketPurchaseResponse, UpdateExhibitionDto } from "@/types/exhibition";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";
import { createAxiosInstance } from '@/lib/axios';

export const getExhibitions = async (accessToken: string, params?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
}): Promise<ApiResponse<GetExhibitionsResponse>> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sort) queryParams.set('sort', JSON.stringify(params.sort));
        if (params?.search) queryParams.set('search', params.search);

        const url = `/exhibitions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await createApi(accessToken).get(url);
        return res.data;

        // return {
        //     status: 200,
        //     errorCode: '',
        //     details: null,
        //     message: 'Success',
        //     data: {
        //         exhibitions: [],
        //         pagination: {
        //             total: 0,
        //             page: 1,
        //             limit: 10,
        //             pages: 0,
        //             hasNext: false,
        //             hasPrev: false
        //         }
        //     }
        // }

    } catch (error) {
        console.error('Error getting gallery templates:', error);
        throw handleApiError<GetExhibitionsResponse>(
            error,
            'Failed to fetch gallery templates'
        );
    }
}
export const getUserExhibitions = async (accessToken: string, params?: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    search?: string;
}): Promise<ApiResponse<GetExhibitionsResponse>> => {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.set('page', params.page.toString());
        if (params?.limit) queryParams.set('limit', params.limit.toString());
        if (params?.sort) queryParams.set('sort', JSON.stringify(params.sort));
        if (params?.search) queryParams.set('search', params.search);

        const url = `/exhibition/user-exhibitions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const res = await createApi(accessToken).get(url);

        return res.data;

    } catch (error) {
        console.error('Error getting gallery templates:', error);
        throw handleApiError<GetExhibitionsResponse>(
            error,
            'Failed to fetch gallery templates'
        );
    }
}


export const createExhibition = async (accessToken: string, templateId: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const res = await createApi(accessToken).post('/exhibition', {
            gallery: templateId
        });
        return res.data;
    } catch (error) {
        console.error('Error creating exhibition:', error);
        throw handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to create exhibition'
        );
    }
}



export const updateExhibition = async (accessToken: string, id: string, data: UpdateExhibitionDto): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const res = await createApi(accessToken).patch(`/exhibition/${id}`, data);
        return res.data;
    } catch (error) {
        console.error('Error updating exhibition:', error);
        throw handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to update exhibition'
        );
    }
}

export const getExhibitionById = async (id: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        const res = await createApi(user.accessToken).get(`/exhibition/${id}`);
        return res.data;
    } catch (error) {
        console.error('Error getting exhibition by ID:', error);
        throw handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to get exhibition by ID'
        );
    }
}

export const getExhibitionByLinkName = async (linkName: string): Promise<ApiResponse<ExhibitionRequestResponse>> => {
    try {
        const res = await createApi().get(`/exhibition/public/link/${linkName}`);
        return res.data;
    } catch (error) {
        console.error('Error getting exhibition by link name:', error);
        throw handleApiError<ExhibitionRequestResponse>(
            error,
            'Failed to get exhibition by link name'
        );
    }
}

export const purchaseExhibitionTicket = async (accessToken: string, exhibitionId: string): Promise<ApiResponse<TicketPurchaseResponse>> => {
    try {
        const res = await createApi(accessToken).post(`/exhibition/${exhibitionId}/ticket/purchase`);
        return res.data;
    } catch (error) {
        console.error('Error purchasing exhibition ticket:', error);
        throw handleApiError<TicketPurchaseResponse>(
            error,
            'Failed to purchase exhibition ticket'
        );
    }
}


export const toggleArtworkLike = async (
    accessToken: string,
    exhibitionId: string,
    artworkId: string
  ): Promise<ApiResponse<LikeArtworkResponse>> => {
    try {
      const res = await createApi(accessToken).post(`/exhibition/${exhibitionId}/artwork/like`, {
        artworkId
      });
      return res.data;
    } catch (error) {
      console.error('Error toggling artwork like:', error);
      throw handleApiError<{liked: boolean}>(
        error,
        'Failed to toggle artwork like status'
      );
    }
  }

export const getPublicExhibitions = async ({
  page = 1,
  limit = 12,
  sort,
  filter,
  search,
  status,
}: {
  page?: number;
  limit?: number;
  sort?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  search?: string;
  status?: string | string[];
}): Promise<ApiResponse<GetPublicExhibitionsResponse>> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (sort) {
      queryParams.set('sort', JSON.stringify(sort));
    }
    
    if (filter) {
      queryParams.set('filter', JSON.stringify(filter));
    }
    
    if (search) {
      queryParams.set('search', search);
    }
    
    if (status) {
      // Handle status as a direct URL parameter instead of part of filter
      if (Array.isArray(status)) {
        queryParams.set('status', status.join(','));
      } else {
        queryParams.set('status', status);
      }
    }

    // Change the endpoint to match your example
    const response = await createApi().get(`/exhibition/public?${queryParams}`);
    return response.data;
  } catch (error) {
    throw handleApiError<GetExhibitionsResponse>(
      error, 
      'Failed to fetch exhibitions'
    );
  }
};


export const updateExhibitionAnalytics = async (
  id: string, 
  totalTime: number
): Promise<ApiResponse<ExhibitionRequestResponse>> => {
  try {
    const res = await createApi().patch(`/exhibition/${id}/analytics`, { totalTime });
    return res.data;
  } catch (error) {
    console.error('Error updating exhibition analytics:', error);
    throw handleApiError<ExhibitionRequestResponse>(
      error,
      'Failed to update exhibition analytics'
    );
  }
}

export const deleteExhibition = async (id: string) => {
  try {
    const axios = await createAxiosInstance({ useToken: true });
    if (!axios) {
      throw new Error('Failed to create axios instance');
    }
    const res = await axios.delete(`/exhibition/${id}`);
    return res.data;
  }
  catch (error) {
    console.error('Error deleting exhibition:', error);
    throw handleApiError(
      error,
      'Failed to delete exhibition'
    );
  }
}