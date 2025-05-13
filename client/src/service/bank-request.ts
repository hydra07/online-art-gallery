import { createAxiosInstance } from '@/lib/axios';

export interface BankRequestForm {
    bankName: string;
    bankAccountName: string;
    idBankAccount: string;
    amount: number;
}


const bankRequestService = {
    async get() {
        try {
            const axios = await createAxiosInstance({ useToken: true });
            if (!axios) {
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.get(`/bank-request/withdrawals`);
            return res.data;
        } catch (error) {
            console.error('Error getting bank requests:', error);
            return null;
        }

    },

    async createWithdrawRequest(data: BankRequestForm) {
        try {
            const axios = await createAxiosInstance({ useToken: true });
            if (!axios) {
                throw new Error('Failed to create axios instance');
            }
            const res = await axios.post(`/bank-request/withdraw`, data);
            return res.data;
        } catch (error) {
            console.error('Error creating bank request:', error);
            return null;
        }
    }
}

export default bankRequestService;