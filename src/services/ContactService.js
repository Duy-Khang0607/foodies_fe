import { api } from "../lib/axios";

export const sendContactEmail = async (data) => {
    try {
        const response = await api.post(`/portfolio/contact`, data);
        return response?.data;
    } catch (error) {
        if (error.response) {
            return error.response.data;
        }
        throw error;
    }
}