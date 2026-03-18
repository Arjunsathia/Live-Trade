import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    setLeaderboard, setSubscriptions, 
    addSubscription, removeSubscription, updateSubscriptionStats,
    selectLeaderboard, selectSubscriptions 
} from '../store/copySlice';
import { copyApi } from '../api/copyApi';
import { socketClient } from '../../../services/websocket/socketClient';

export const useCopyTrading = () => {
    const dispatch = useDispatch();
    const leaderboard = useSelector(selectLeaderboard);
    const subscriptions = useSelector(selectSubscriptions);

    // Initial load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [leaderboardData, subscriptionsData] = await Promise.all([
                    copyApi.getLeaderboard(),
                    copyApi.getSubscriptions()
                ]);
                dispatch(setLeaderboard(leaderboardData));
                dispatch(setSubscriptions(subscriptionsData));
            } catch (err) {
                console.error("Failed to load copy trading data:", err);
            }
        };
        
        fetchInitialData();
    }, [dispatch]);

    // WebSocket subscription for copy-trading events
    useEffect(() => {
        const unsubscribe = socketClient.subscribe('copy_event', (data) => {
            // events: trade_copied, profit_update, provider_update
            if (data.type === 'trade_copied') {
                // We might just update a stats value rather than logging each trade here,
                // or we could dispatch it to the activity feed
            } else if (data.type === 'profit_update') {
                dispatch(updateSubscriptionStats({
                    id: data.subscriptionId,
                    currentProfit: data.currentProfit,
                }));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    const follow = useCallback(async (providerId, settings) => {
        try {
            const newSub = await copyApi.followProvider({ providerId, settings });
            dispatch(addSubscription(newSub));
            return newSub;
        } catch (err) {
            console.error("Failed to subscribe to provider", err);
            throw err;
        }
    }, [dispatch]);

    const unfollow = useCallback(async (subscriptionId) => {
        try {
            await copyApi.unfollowProvider(subscriptionId);
            dispatch(removeSubscription({ id: subscriptionId }));
        } catch (err) {
            console.error("Failed to unsubscribe", err);
            throw err;
        }
    }, [dispatch]);

    return {
        leaderboard,
        subscriptions,
        follow,
        unfollow
    };
};
