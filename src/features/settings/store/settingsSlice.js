import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        profile: {
            displayName: '',
            email: '',
            avatar: null,
            country: '',
            currency: 'USD',
        },
        security: {
            twoFactorEnabled: false,
            lastPasswordChange: null,
        },
        kyc: {
            status: 'unverified',  // 'unverified' | 'pending' | 'verified' | 'rejected'
            submittedAt: null,
        },
        preferences: {
            theme: 'dark',
            language: 'en',
            notifications: true,
        },
        status: 'idle',
        error: null,
    },
    reducers: {
        setProfile: (state, action) => { state.profile = { ...state.profile, ...action.payload }; },
        setSecurity: (state, action) => { state.security = { ...state.security, ...action.payload }; },
        setKyc: (state, action) => { state.kyc = { ...state.kyc, ...action.payload }; },
        setPreferences: (state, action) => { state.preferences = { ...state.preferences, ...action.payload }; },
        setStatus: (state, action) => { state.status = action.payload; },
        setError: (state, action) => { state.error = action.payload; },
    },
});

export const { setProfile, setSecurity, setKyc, setPreferences, setStatus, setError } = settingsSlice.actions;
export default settingsSlice.reducer;
