import { createApi, createAxiosInstance } from "@/lib/axios";
import { ArtworksResponse } from "@/types/artwork";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

// First, define an enum for moderation status
export enum ArtworkModerationStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending'
}

// Define an interface for the query parameters
export interface ArtistArtworksParams {
  skip?: number;
  take?: number;
  moderationStatus?: ArtworkModerationStatus;
  category?: string;
  status?: string;
  sortBy?: 'createdAt' | 'title' | 'views';
  sortOrder?: 'asc' | 'desc';
}

export const getArtistArtworks = async (
  accessToken: string,
  params: ArtistArtworksParams = {}
): Promise<ApiResponse<ArtworksResponse>> => {
    try {
        // Merge default params with provided params
        const queryParams: ArtistArtworksParams = {
            ...params,
        };

        // Remove undefined values
        const cleanParams = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(queryParams).filter(([_, value]) => value !== undefined)
        );

        const res = await createApi(accessToken).get('/artwork/artist', {
            params: cleanParams
        });

        return res.data;
    } catch (error) {
        console.error('Error getting artist artworks:', error);
        return handleApiError<ArtworksResponse>(
            error,
            'Failed to fetch artist artworks'
        );
    }
};


export const getByArtistId = async (
    artistId: string,
    params: ArtistArtworksParams = {}
): Promise<ApiResponse<ArtworksResponse>> => {
    try {
        // Merge default params with provided params
        const queryParams: ArtistArtworksParams = {
            ...params,
        };

        // Remove undefined values
        const cleanParams = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(queryParams).filter(([_, value]) => value !== undefined)
        );

        const res = await createApi().get(`/artwork/artist/${artistId}`, {
            params: cleanParams
        });

        console.log('rez', res.data);   
        return res.data;
    } catch (error) {
        console.error('Error getting artist artworks:', error);
        return handleApiError<ArtworksResponse>(
            error,
            'Failed to fetch artist artworks'
        );
    }
}
// Định nghĩa interface cho thông tin khi mua tranh
export interface PurchaseArtworkResponse {
    success: boolean;
    message: string;
    downloadUrl?: string;
    balance?: number;
}

// Lấy thông tin số dư ví của người dùng
export const getUserBalance = async (accessToken: string): Promise<ApiResponse<{ balance: number }>> => {
    try {
        const res = await createApi(accessToken).get('/wallet');
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy số dư ví:', error);
        return handleApiError<{ balance: number }>(
            error,
            'Không thể lấy thông tin số dư ví'
        );
    }
};

// Xử lý thanh toán mua tranh
export const purchaseArtwork = async (
    accessToken: string,
    artworkId: string
): Promise<ApiResponse<PurchaseArtworkResponse>> => {
    try {
        const res = await createApi(accessToken).post(`/artwork/${artworkId}/purchase`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi mua tranh:', error);
        return handleApiError<PurchaseArtworkResponse>(
            error,
            'Không thể hoàn tất giao dịch mua tranh'
        );
    }
};


// Tải ảnh sau khi mua tranh thành công
export const downloadArtwork = async (
    accessToken: string,
    artworkId: string,
    downloadToken: string
): Promise<Blob> => {
    try {
        const res = await createApi(accessToken).get(`/artwork/download/${artworkId}`, {
            params: { token: downloadToken },
            responseType: 'blob'
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        throw new Error('Không thể tải ảnh');
    }
};

// Kiểm tra xem người dùng đã mua tranh chưa
export const checkUserPurchased = async (
    accessToken: string,
    artworkId: string
): Promise<ApiResponse<{ hasPurchased: boolean }>> => {
    try {
        const res = await createApi(accessToken).get(`/artwork/${artworkId}/check-purchased`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái mua tranh:', error);
        return handleApiError<{ hasPurchased: boolean }>(
            error,
            'Không thể kiểm tra trạng thái mua tranh'
        );
    }
};


const artworkService = {
    async getUserBalance (): Promise<ApiResponse<{ balance: number }>> {
        try {
            const axios = await createAxiosInstance({ useToken: true });
            if (!axios) {
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get("/wallet");
            // const res = await createApi(accessToken).get('/wallet');
            return res.data;
        } catch (error) {
            console.error('Lỗi khi lấy số dư ví:', error);
            return handleApiError<{ balance: number }>(
                error,
                'Không thể lấy thông tin số dư ví'
            );
        }
    },
    async checkUserPurchased (artworkId: string): Promise<ApiResponse<{ hasPurchased: boolean }>> {
        try {
            const axios = await createAxiosInstance({ useToken: true });
            if (!axios) {
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get(`/artwork/${artworkId}/check-purchased`);
            // const res = await createApi(accessToken).get(`/artwork/${artworkId}/check-purchased`);
            // console.log('rescac', res.data);
            return res.data;
        } catch (error) {
            console.error('Lỗi khi kiểm tra trạng thái mua tranh:', error);
            return handleApiError<{ hasPurchased: boolean }>(
                error,
                'Không thể kiểm tra trạng thái mua tranh'
            );
        }
    },
    async purchaseArtwork (artworkId: string): Promise<ApiResponse<PurchaseArtworkResponse>> {
        try {
            const axios = await createAxiosInstance({ useToken: true });
            if (!axios) {
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.post(`/artwork/${artworkId}/purchase`);
            // const res = await createApi(accessToken).post(`/artwork/${artworkId}/purchase`);
            return res.data;
        } catch (error) {
            console.error('Lỗi khi mua tranh:', error);
            return handleApiError<PurchaseArtworkResponse>(
                error,
                'Không thể hoàn tất giao dịch mua tranh'
            );
        }
    }
}
export default artworkService;