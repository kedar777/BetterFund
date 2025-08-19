import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    isAdmin: false,
    loading: false,
    error: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isAdmin = action.payload.isAdmin || false;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isAdmin = false;
            state.loading = false;
            state.error = null;
        },
        updateProfile: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        }
    },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } = authSlice.actions;

export default authSlice.reducer;
