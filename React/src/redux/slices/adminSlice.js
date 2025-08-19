import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pendingCampaigns: [],
    pendingRequests: [],
    stats: {
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalRaised: 0,
        pendingApprovals: 0
    },
    loading: false,
    error: null
};

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        fetchAdminDataStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAdminDataSuccess: (state, action) => {
            state.pendingCampaigns = action.payload.pendingCampaigns;
            state.pendingRequests = action.payload.pendingRequests;
            state.stats = action.payload.stats;
            state.loading = false;
        },
        fetchAdminDataFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        approveCampaign: (state, action) => {
            state.pendingCampaigns = state.pendingCampaigns.filter(
                campaign => campaign.id !== action.payload.campaignId
            );
            state.stats.pendingApprovals -= 1;
            state.stats.activeCampaigns += 1;
        },
        rejectCampaign: (state, action) => {
            state.pendingCampaigns = state.pendingCampaigns.filter(
                campaign => campaign.id !== action.payload.campaignId
            );
            state.stats.pendingApprovals -= 1;
        },
        approveRequest: (state, action) => {
            state.pendingRequests = state.pendingRequests.filter(
                request => request.id !== action.payload.requestId
            );
            state.stats.pendingApprovals -= 1;
        },
        updateStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        }
    },
});

export const {
    fetchAdminDataStart,
    fetchAdminDataSuccess,
    fetchAdminDataFailure,
    approveCampaign,
    rejectCampaign,
    approveRequest,
    updateStats
} = adminSlice.actions;

export default adminSlice.reducer;
