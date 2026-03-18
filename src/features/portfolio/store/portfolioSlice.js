import { createSlice } from '@reduxjs/toolkit';

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: {
        holdings: [],
        positions: [],
        history: [],
        pnl: {
            daily: 0,
            weekly: 0,
            monthly: 0,
            total: 0,
        },
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        setHoldings: (state, action) => { state.holdings = action.payload; },
        setPositions: (state, action) => { state.positions = action.payload; },
        setHistory: (state, action) => { state.history = action.payload; },
        setPnl: (state, action) => { state.pnl = action.payload; },
        setStatus: (state, action) => { state.status = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
    },
});

export const { setHoldings, setPositions, setHistory, setPnl, setStatus, setError } = portfolioSlice.actions;
export default portfolioSlice.reducer;
