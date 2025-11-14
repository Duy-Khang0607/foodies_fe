import axios from "axios";
import { api } from "../lib/axios";



export const loginUser = async (data) => {
    try {
        const response = await api.post(`/auth/login`, { ...data, expiresInMins: 30 });
        return response?.data;
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

export const signupUser = async (data) => {
    try {
        const response = await api.post(`/auth/register`, data);
        return response?.data;
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

export const updateProfile = async (data) => {
    try {
        const response = await api.put(`/auth/profile`, data, {
        });
        return response?.data;
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await api.get(`/auth/profile`, {
        });
        return response?.data;
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

export const refreshToken = async (refreshTokenValue) => {
    try {
        const response = await api.post(`/auth/refresh-token`, {
            refreshToken: refreshTokenValue
        });
        return response?.data;
    } catch (error) {
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}

export const forgotPassword = async (data) => {
    try {
        const response = await api.post(`/auth/forgot-password`, data, {
        });
        return response?.data;
    }
    catch (error) {
        if (error) {
            return error;
        }
        throw error;
    }
}

export const resetPassword = async (data) => {
    try {
        const response = await api.post(`/auth/reset-password`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response?.data;
    }
    catch (error) {
        if (error) {
            return error;
        }
        throw error;
    }
}

export const changePassword = async (data) => {
    try {
        const response = await api.put(`/auth/change-password`, data, {
        });
        return response?.data;
    }
    catch (error) {
        if (error) {
            return error;
        }
        throw error;
    }
}


