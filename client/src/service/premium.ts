import { createApi } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";


export const buyPremium = async (accessToken: string): Promise<ApiResponse<{ premiumEndDate: string }>> => {
   try {
    const res = await createApi(accessToken).post('/premium/subscribe');
    return res.data;
   } catch (error) {
    return handleApiError<{ premiumEndDate: string }>(error, 'Lỗi khi mua gói Premium');
   }
}

export const cancelPremium = async (accessToken: string): Promise<ApiResponse<{ message: string }>> => {
    try {
        const res = await createApi(accessToken).post('/premium/unsubscribe');
        return res.data;
    } catch (error) {
        return handleApiError<{ message: string }>(error, 'Lỗi khi hủy gói Premium');
    }
}

export const checkPremium = async (accessToken: string): Promise<ApiResponse<{
    premiumStatus: 'active' | 'cancelled' | 'expired' | 'none';
    message: string;
    endDate?: string;
}>> => {
    try {
        const res = await createApi(accessToken).get('/premium/status');
        return res.data;
    } catch (error) {
        return handleApiError<{
            premiumStatus: 'active' | 'cancelled' | 'expired' | 'none';
            message: string;
            endDate?: string;
        }>(error, 'Lỗi khi kiểm tra trạng thái Premium');
    }
}

export const checkPremiumLimits = async (accessToken: string): Promise<ApiResponse<{ message: string }>> => {
    try {
        const res = await createApi(accessToken).get('/premium/limits');
        return res.data;
    } catch (error) {
        return handleApiError<{ message: string }>(error, 'Lỗi khi kiểm tra giới hạn Premium');
    }
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
