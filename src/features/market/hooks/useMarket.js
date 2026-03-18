import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePrice, selectActiveSymbol, selectCurrentPrices, setLoading } from '../store/marketSlice';
import { socketClient } from '../../../services/websocket/socketClient';

export const useMarket = () => {
    const dispatch = useDispatch();
    const activeSymbol = useSelector(selectActiveSymbol);
    const prices = useSelector(selectCurrentPrices);
    const currentPrice = prices[activeSymbol];

    // Listen to real-time price updates for active symbol
    useEffect(() => {
        if (!activeSymbol) return;

        const unsubscribe = socketClient.subscribe('market_data', (data) => {
            if (data.symbol === activeSymbol) {
                dispatch(updatePrice({ symbol: data.symbol, price: data.price }));
            }
        });

        // Setup the subscription channel request to backend
        socketClient.send({
            type: 'subscribe',
            channel: 'ticker',
            symbol: activeSymbol
        });

        return () => {
            unsubscribe();
            socketClient.send({
                type: 'unsubscribe',
                channel: 'ticker',
                symbol: activeSymbol
            });
        };
    }, [activeSymbol, dispatch]);

    const changeSymbol = useCallback((symbol) => {
        dispatch(setLoading(true));
        // dispatch(setActiveSymbol(symbol)) -- handled mostly in UI,
        // but here is a wrapper for additional side effects
        dispatch({ type: 'market/setActiveSymbol', payload: symbol });
        setTimeout(() => dispatch(setLoading(false)), 300); // Simulate API latency
    }, [dispatch]);

    return {
        activeSymbol,
        currentPrice: currentPrice || 0,
        changeSymbol
    };
};
