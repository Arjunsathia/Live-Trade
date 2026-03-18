import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    providers: [],          // List of master traders available to copy
    subscriptions: [],      // Active copy-trading subscriptions
    leaderboard: [],        // Top performing providers
    isLoading: false,
    error: null,
};

const copySlice = createSlice({
    name: 'copy',
    initialState,
    reducers: {
        setProviders: (state, action) => {
            state.providers = action.payload;
        },
        setLeaderboard: (state, action) => {
            state.leaderboard = action.payload;
        },
        setSubscriptions: (state, action) => {
            state.subscriptions = action.payload;
        },
        addSubscription: (state, action) => {
            state.subscriptions.push(action.payload);
        },
        removeSubscription: (state, action) => {
            const index = state.subscriptions.findIndex(sub => sub.id === action.payload.id);
            if (index !== -1) {
                state.subscriptions.splice(index, 1);
            }
        },
        updateSubscriptionStats: (state, action) => {
            const { id, currentProfit, activeTrades } = action.payload;
            const sub = state.subscriptions.find(s => s.id === id);
            if (sub) {
                if (currentProfit !== undefined) sub.currentProfit = currentProfit;
                if (activeTrades !== undefined) sub.activeTrades = activeTrades;
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { 
    setProviders, setLeaderboard, setSubscriptions, 
    addSubscription, removeSubscription, updateSubscriptionStats,
    setLoading, setError 
} = copySlice.actions;

export const selectLeaderboard = (state) => state.copy.leaderboard;
export const selectSubscriptions = (state) => state.copy.subscriptions;

export default copySlice.reducer;
