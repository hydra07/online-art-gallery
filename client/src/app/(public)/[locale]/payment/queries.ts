import { createAxiosInstance } from "@/lib/axios";

const paymentService = {
    async createPayment(amout: number, description: string) {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');
        const response = await axios.post('/payment/create', {
            amount: amout,
            description: description
        });
        return response.data;
    },
    async verifyPayment(paymentId: string, orderCode: string, status: string) {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');
        const response = await axios.get(`/payment/verify/${paymentId}?orderCode=${orderCode}&status=${status}`);
        return response.data;
    },
    async get(skip?: number, take?: number) {
        const axios = await createAxiosInstance({ useToken: true });
        if (!axios) throw new Error('Failed to create Axios instance');

        // More efficient way to build URL with parameters
        const params: Record<string, number> = {};
        if (skip !== undefined) params.skip = skip;
        if (take !== undefined) params.take = take;
        
        const response = await axios.get('/payment/', { params });
        return response.data;
    }


}

export default paymentService;