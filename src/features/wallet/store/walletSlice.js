import { createSlice } from '@reduxjs/toolkit';

const walletSlice = createSlice({
    name: 'wallet',
    initialState: {
        balance: {
            total: 0,
            available: 0,
            inUse: 0,
        },
        transactions: [],
        depositStatus: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
        withdrawStatus: 'idle',
        error: null,
    },
    reducers: {
        setBalance: (state, action) => { state.balance = action.payload; },
        setTransactions: (state, action) => { state.transactions = action.payload; },
        addTransaction: (state, action) => { state.transactions.unshift(action.payload); },
        setDepositStatus: (state, action) => { state.depositStatus = action.payload; },
        setWithdrawStatus: (state, action) => { state.withdrawStatus = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
    },
});

export const { setBalance, setTransactions, addTransaction, setDepositStatus, setWithdrawStatus, setError } = walletSlice.actions;
export default walletSlice.reducer;
