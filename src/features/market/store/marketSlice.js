import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    watchlist: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'],
    activeSymbol: 'EURUSD',
    bars: {}, // Data structure: { "EURUSD": [{time, open, high, low, close}] }
    currentPrices: {}, // Live prices: { "EURUSD": 1.0542 }
    isLoading: false,
    error: null,
};

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        setActiveSymbol: (state, action) => {
            state.activeSymbol = action.payload;
        },
        updatePrice: (state, action) => {
            const { symbol, price } = action.payload;
            state.currentPrices[symbol] = price;
        },
        setBars: (state, action) => {
            const { symbol, bars } = action.payload;
            state.bars[symbol] = bars;
        },
        addBar: (state, action) => {
            const { symbol, bar } = action.payload;
            if (!state.bars[symbol]) {
                state.bars[symbol] = [];
            }
            // Add new bar or update last bar if time matches
            const lastBar = state.bars[symbol][state.bars[symbol].length - 1];
            if (lastBar && lastBar.time === bar.time) {
                state.bars[symbol][state.bars[symbol].length - 1] = bar;
            } else {
                state.bars[symbol].push(bar);
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

export const { setActiveSymbol, updatePrice, setBars, addBar, setLoading, setError } = marketSlice.actions;

export const selectActiveSymbol = (state) => state.market.activeSymbol;
export const selectCurrentPrices = (state) => state.market.currentPrices;
export const selectWatchlist = (state) => state.market.watchlist;

export default marketSlice.reducer;
