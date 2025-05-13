import { createApi } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

export interface ArtworkWarehouseItem {
    _id: string;
    userId: string;
    artworkId: {
        _id: string;
        title: string;
        description?: string;
        url: string;
        price: number;
        artistId?: {
            _id: string;
            name: string;
            image?: string;
        };
        dimensions: {
            width: number;
            height: number;
        };
    };
    purchasedAt: string;
    downloadedAt?: string;
    downloadCount: number;
}

interface ArtworkWarehouseResponse {
    items: ArtworkWarehouseItem[];
    total: number;
    page: number;
    limit: number;
}

// Lấy danh sách tranh đã mua
export const getArtworkWarehouse = async (
    accessToken: string,
    params?: { page?: number; limit?: number; filter?: string }
): Promise<ApiResponse<ArtworkWarehouseResponse>> => {
    try {
        const res = await createApi(accessToken).get('/artwork-warehouse', { params });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy kho tranh:', error);
        throw handleApiError<ArtworkWarehouseResponse>(
            error,
            'Không thể lấy danh sách tranh trong kho'
        );
    }
};

// Tải ảnh từ kho tranh
export const downloadWarehouseArtwork = async (
    accessToken: string,
    warehouseItemId: string
): Promise<Blob> => {
    try {
        const res = await createApi(accessToken).get(`/artwork-warehouse/download/${warehouseItemId}`, {
            responseType: 'blob'
        });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi tải ảnh từ kho:', error);
        throw new Error('Không thể tải ảnh');
    }
}; 