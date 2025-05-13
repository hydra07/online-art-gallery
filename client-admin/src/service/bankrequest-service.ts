import { createAxiosInstance } from '@/lib/axios';

const bankrequestService = {
    async get() {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error("Failed to create axios instance");
        }
        const res = await axios.get("bank-request/withdrawals/all");
        return res.data;
    },

    async approveWithdrawalRequest(bankRequestId: string) {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error("Failed to create axios instance");
        }
        const res = await axios.put(`/bank-request/withdraw/${bankRequestId}/approve`);
        return res.data;
    },
    
    async rejectWithdrawalRequest(bankRequestId: string) {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) {
            throw new Error("Failed to create axios instance");
        }
        const res = await axios.put(`/bank-request/withdraw/${bankRequestId}/reject`);
        return res.data;
    },
}
export default bankrequestService;