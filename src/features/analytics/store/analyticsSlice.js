import { createSlice } from '@reduxjs/toolkit';

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState: {
        performance: {
            equityCurve: [],    // [{ date, equity }]
            totalReturn: 0,
            sharpeRatio: 0,
            maxDrawdown: 0,
            winRate: 0,
            profitFactor: 0,
        },
        riskMetrics: {
            valueAtRisk: 0,
            averageRR: 0,
            largestWin: 0,
            largestLoss: 0,
        },
        timeframe: '1M',        // '1W' | '1M' | '3M' | '1Y' | 'ALL'
        status: 'idle',
        error: null,
    },
    reducers: {
        setPerformance: (state, action) => { state.performance = action.payload; },
        setRiskMetrics: (state, action) => { state.riskMetrics = action.payload; },
        setTimeframe: (state, action) => { state.timeframe = action.payload; },
        setStatus: (state, action) => { state.status = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
    },
});

export const { setPerformance, setRiskMetrics, setTimeframe, setStatus, setError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
