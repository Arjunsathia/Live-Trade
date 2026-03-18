import { api } from '../../../services/api/axiosClient';

export const ordersApi = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },
    
    getOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    cancelOrder: async (orderId) => {
        const response = await api.delete(`/orders/${orderId}`);
        return response.data;
    }
};
