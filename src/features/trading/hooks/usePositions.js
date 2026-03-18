import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setPositions, addPosition, closePosition, 
    updatePositionPnL, selectAllPositions 
} from '../store/tradingSlice';
import { positionsApi } from '../api/positionsApi';
import { socketClient } from '../../../services/websocket/socketClient';

export const usePositions = () => {
    const dispatch = useDispatch();
    const positions = useSelector(selectAllPositions);

    // Initial load
    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const data = await positionsApi.getPositions();
                dispatch(setPositions(data));
            } catch (err) {
                console.error("Failed to load positions", err);
            }
        };
        fetchPositions();
    }, [dispatch]);

    // WebSocket subscription for position updates
    useEffect(() => {
        const unsubscribe = socketClient.subscribe('position_update', (data) => {
            // Depending on event type (new, closed, tick_update)
            if (data.type === 'opened') {
                dispatch(addPosition(data.position));
            } else if (data.type === 'closed') {
                dispatch(closePosition({ id: data.positionId }));
            } else if (data.type === 'pnl_update') {
                dispatch(updatePositionPnL({ 
                    id: data.positionId, 
                    unrealizedPnl: data.unrealizedPnl 
                }));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    const executeClose = useCallback(async (positionId) => {
        try {
            await positionsApi.closePosition(positionId);
            // Optimistic UI update or rely on WS
            dispatch(closePosition({ id: positionId }));
        } catch (err) {
            console.error("Failed to close position", err);
            throw err;
        }
    }, [dispatch]);

    return {
        positions,
        executeClose
    };
};
