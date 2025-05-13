import { createApi } from "@/lib/axios";
import { getCurrentUser } from "@/lib/session";
import axiosInstance from 'axios';

interface PaymentResponse {
    success: boolean;
    paymentUrl?: string;
    error?: string;
}

export const createPayment = async (token: string,amount: number) => {
    try {
        const response = await createApi(token).post('/payment/create-payment', {
            amount
        });
        return response.data;
    } catch (error) {
        if (axiosInstance.isAxiosError(error)) {
            console.error(
                `Error when get blog by id: ${error.response?.data.message}`
            );
        } else {
            console.error(`Unexpected error: ${error}`);
        }
    }
}


export const verifyPayment = async (token: string,paymentId: string) => {
    try {
        const response = await createApi(token).get(`/payment/verify/${paymentId}`);

        if (!response.status) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }    
        return response.data;
    } catch (error) {
        console.error('Payment verification failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Payment verification failed'
        };
    }
}
