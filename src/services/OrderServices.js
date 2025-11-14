import { api } from "../lib/axios";

export const createOrder = async (orderData) => {
    try {
        const response = await api.post(`/orders/create-order`, orderData);
        return response?.data;
    } catch (error) {
        throw error;
    }
}
export const getOrders = async (page = 1, limit = 12) => {
    try {
        const response = await api.get(`/orders/get-all-orders?page=${page}&limit=${limit}`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const getOrderById = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const updateOrderStatus = async (id, status) => {
    try {
        const response = await api.put(`/orders/${id}`, { status });
        return response?.data;
    } catch (error) {
        throw error;
    }
}

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/orders/${id}`);
        return response?.data;
    } catch (error) {
        throw error;
    }
}


