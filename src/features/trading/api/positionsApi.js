import { api } from '../../../services/api/axiosClient';

export const positionsApi = {
    getPositions: async () => {
        const response = await api.get('/positions');
        return response.data;
    },
    
    closePosition: async (positionId) => {
        const response = await api.delete(`/positions/${positionId}`);
        return response.data;
    }
};
