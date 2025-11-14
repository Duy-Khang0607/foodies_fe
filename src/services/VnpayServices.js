import { api } from "../lib/axios";


export const createPayment = async (data) => {
    try {
        const response = await api.post(`/vnpay/create-payment`, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const checkPayment = async (data) => {
    try {
        const response = await api.post(`/vnpay/check-payment`, data);
        return response;
    } catch (error) {
        throw error;
    }
}
