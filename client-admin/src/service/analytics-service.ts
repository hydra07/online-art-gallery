import { createApi, createAxiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/response';
import { handleApiError } from '@/utils/error-handler';


export async function getAllUser() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/user/all-user');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export async function getAllArtwork({
    skip = 0,
    take = 10
}: {
    skip?: number;
    take?: number;
}   ) {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const params = new URLSearchParams();
        params.append("skip", skip.toString());
        params.append("take", take.toString());
        const res = await axios.get(`/artwork/admin?${params.toString()}`);
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export async function getAllGallery() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/gallery');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export async function getAllTransaction() {
    try {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error('Failed to create axios instance');
        }
        const res = await axios.get('/wallet/admin/transactions');
        return res.data;
    } catch (error) {
        console.error('Error getting all users:', error);
        return null;
    }
};

export const getExhibitions = async (accessToken: string): Promise<ApiResponse<any>> => {
    try {
      const res = await createApi(accessToken).get('/exhibition/user-exhibitions');
      return res.data;
    } catch (error) {
      console.error("Error getting exhibitions:", error);
      return handleApiError<any>(
        error,
        "Failed to fetch exhibition history"
      );
    }
  };
