import { api } from '../../../services/api/axiosClient';

export const copyApi = {
    getLeaderboard: async (params = { sortBy: 'roi', limit: 10 }) => {
        const response = await api.get('/copy/leaderboard', { params });
        return response.data;
    },
    
    getProviders: async () => {
        const response = await api.get('/copy/providers');
        return response.data;
    },

    getSubscriptions: async () => {
        const response = await api.get('/copy/subscriptions');
        return response.data;
    },

    followProvider: async ({ providerId, settings }) => {
        const response = await api.post('/copy/subscribe', { providerId, settings });
        return response.data;
    },

    unfollowProvider: async (subscriptionId) => {
        const response = await api.delete(`/copy/subscribe/${subscriptionId}`);
        return response.data;
    }
};
