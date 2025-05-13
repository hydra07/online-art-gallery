import { createApi } from "@/lib/axios";
import { ApiResponse } from "@/types/response";
import { handleApiError } from "@/utils/error-handler";

export interface Transaction {
    _id: string;
    walletId: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'SALE' | 'COMMISSION' | 'PREMIUM_SUBSCRIPTION' | 'TICKET_SALE';
    status: 'PENDING' | 'PAID' | 'FAILED';
    orderCode: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TransactionsResponse {
    transactions: Transaction[];
    total: number;
  }
  
  export const getTransactions = async (accessToken: string): Promise<ApiResponse<TransactionsResponse>> => {
    try {
      const res = await createApi(accessToken).get('/wallet/transactions');
      return res.data;
    } catch (error) {
      console.error("Error getting transactions:", error);
      return handleApiError<TransactionsResponse>(
        error,
        "Failed to fetch transaction history"
      );
    }
  };

  export const getExhibitions = async (
    accessToken: string,
    limit: number = 1000 // đặt limit lớn hơn mặc định
  ): Promise<ApiResponse<any>> => {
    try {
      const res = await createApi(accessToken).get('/exhibition/user-exhibitions', {
        params: { page: 1, limit } // truyền limit lớn để tránh phân trang
      });
      return res.data;
    } catch (error) {
      console.error("Error getting exhibitions:", error);
      return handleApiError<any>(
        error,
        "Failed to fetch exhibition history"
      );
    }
  };
  
  
  