import { createAxiosInstance } from "@/lib/axios";
import { PaymentData, Transaction, WalletStatistics } from "@/types/payment";
import BaseResponse from "@/types/response";

export type GroupByPeriod = 'day' | 'week' | 'month';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT' | 'SALE';
export type TransactionStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface StatisticsParams {
    startDate?: string;
    endDate?: string;
    groupBy?: GroupByPeriod;
    transactionType?: TransactionType;
    status?: TransactionStatus;
}

const ITEMS_PER_PAGE = 5;

export const walletService = {
    getWallet: async () => {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');
        const response = await axios.get('/wallet');
        // console.log(response.data);
        return response.data;
    },
    getTransaction: async (skip?: number, take: number = ITEMS_PER_PAGE): Promise<BaseResponse<Transaction>> => {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');

        const url = `/wallet/transactions`;

        const response = await axios.get(url);
        return response.data;
    },
    deposit: async (amount: number, description: string, method?: string): Promise<BaseResponse<PaymentData>> => {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');
        const response = await axios.post('/wallet/deposit', { amount, method });
        return response.data;
    },
    getStatistics: async (params?: StatisticsParams): Promise<BaseResponse<WalletStatistics>> => {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');

        // If no params are provided, use the default endpoint (30 days data)
        if (!params) {
            const response = await axios.get('/wallet/statistics');
            return response.data;
        }

        // Otherwise, build query string with provided parameters
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.groupBy) queryParams.append('groupBy', params.groupBy);
        if (params.transactionType) queryParams.append('transactionType', params.transactionType);
        if (params.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        const url = `/wallet/statistics${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(url);
        return response.data;
    }
}