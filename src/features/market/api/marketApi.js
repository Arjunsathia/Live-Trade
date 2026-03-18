import { api as axiosClient } from '../../../services/api/axiosClient';

export const marketApi = {
    getOHLC: async (symbol, resolution = '1D', limit = 100) => {
        const response = await axiosClient.get('/market/ohlc', {
            params: { symbol, resolution, limit }
        });
        return response.data;
    },
    
    getWatchlist: async () => {
        const response = await axiosClient.get('/market/watchlist');
        return response.data;
    }
};
