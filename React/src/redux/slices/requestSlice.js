import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    requests: [],
    loading: false,
    error: null
};

export const requestSlice = createSlice({
    name: 'requests',
    initialState,
    reducers: {
        fetchRequestsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchRequestsSuccess: (state, action) => {
            state.requests = action.payload;
            state.loading = false;
        },
        fetchRequestsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        createRequestSuccess: (state, action) => {
            state.requests.push(action.payload);
        },
        updateRequest: (state, action) => {
            const index = state.requests.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.requests[index] = action.payload;
            }
        },
        approveRequest: (state, action) => {
            const request = state.requests.find(r => r.id === action.payload.requestId);
            if (request) {
                request.approvalCount += 1;
            }
        },
        finalizeRequest: (state, action) => {
            const request = state.requests.find(r => r.id === action.payload.requestId);
            if (request) {
                request.complete = true;
            }
        }
    },
});

export const {
    fetchRequestsStart,
    fetchRequestsSuccess,
    fetchRequestsFailure,
    createRequestSuccess,
    updateRequest,
    approveRequest,
    finalizeRequest
} = requestSlice.actions;

export default requestSlice.reducer;
