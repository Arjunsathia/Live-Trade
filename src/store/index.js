import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import marketReducer from '../features/market/store/marketSlice';
import tradingReducer from '../features/trading/store/tradingSlice';
import copyReducer from '../features/copyTrading/store/copySlice';
import portfolioReducer from '../features/portfolio/store/portfolioSlice';
import walletReducer from '../features/wallet/store/walletSlice';
import analyticsReducer from '../features/analytics/store/analyticsSlice';
import settingsReducer from '../features/settings/store/settingsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        market: marketReducer,
        trading: tradingReducer,
        copy: copyReducer,
        portfolio: portfolioReducer,
        wallet: walletReducer,
        analytics: analyticsReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
