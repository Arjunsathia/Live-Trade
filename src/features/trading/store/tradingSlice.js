import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    positions: [],
    orders: [],
    history: [],
    activeOrders: [],
    isLoading: false,
    error: null,
};

const tradingSlice = createSlice({
    name: 'trading',
    initialState,
    reducers: {
        setPositions: (state, action) => {
            state.positions = action.payload;
        },
        addPosition: (state, action) => {
            state.positions.push(action.payload);
        },
        closePosition: (state, action) => {
            const { id } = action.payload;
            state.positions = state.positions.filter(pos => pos.id !== id);
        },
        updatePositionPnL: (state, action) => {
            const { id, unrealizedPnl } = action.payload;
            const index = state.positions.findIndex(pos => pos.id === id);
            if (index !== -1) {
                state.positions[index].unrealizedPnl = unrealizedPnl;
            }
        },
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    },
});

export const { setPositions, addPosition, closePosition, updatePositionPnL, setOrders, setLoading, setError } = tradingSlice.actions;

export const selectAllPositions = (state) => state.trading.positions;
export const selectActiveOrders = (state) => state.trading.orders;

export default tradingSlice.reducer;
