import { api } from "../lib/axios";


export const addFood = async (data) => {
    try {
        const response = await api.post(`/products`, data);
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteFood = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const getFoods = async () => {
    try {
        const response = await api.get(`/products`);
        return response;
    } catch (error) {
        throw error;
    }
}
export const updateFood = async (id, data) => {
    try {
        const response = await api.put(`/products/${id}`, data);
        return response;
    } catch (error) {
        throw error;
    }
}   

export const getFoodById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
}

