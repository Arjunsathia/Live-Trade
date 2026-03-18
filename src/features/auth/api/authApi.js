import { api as axiosClient } from '../../../services/api/axiosClient';

export const authApi = {
    login: async (credentials) => {
        const response = await axiosClient.post('/auth/login', credentials);
        return response.data;
    },
    
    register: async (userData) => {
        const response = await axiosClient.post('/auth/register', userData);
        return response.data;
    },

    verify2FA: async (code) => {
        const response = await axiosClient.post('/auth/2fa/verify', { code });
        return response.data;
    },

    getUser: async () => {
        const response = await axiosClient.get('/auth/me');
        return response.data;
    }
};
