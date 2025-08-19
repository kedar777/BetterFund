import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    campaigns: [],
    currentCampaign: null,
    loading: false,
    error: null,
    filters: {
        category: 'All',
        search: ''
    }
};

export const campaignSlice = createSlice({
    name: 'campaigns',
    initialState,
    reducers: {
        fetchCampaignsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCampaignsSuccess: (state, action) => {
            state.campaigns = action.payload;
            state.loading = false;
        },
        fetchCampaignsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        setCurrentCampaign: (state, action) => {
            state.currentCampaign = action.payload;
        },
        createCampaignSuccess: (state, action) => {
            state.campaigns.push(action.payload);
        },
        updateCampaign: (state, action) => {
            const index = state.campaigns.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.campaigns[index] = action.payload;
                if (state.currentCampaign?.id === action.payload.id) {
                    state.currentCampaign = action.payload;
                }
            }
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        addContribution: (state, action) => {
            const { campaignId, amount } = action.payload;
            const campaign = state.campaigns.find(c => c.id === campaignId);
            if (campaign) {
                campaign.raised += parseFloat(amount);
                campaign.contributors += 1;
            }
        }
    },
});

export const {
    fetchCampaignsStart,
    fetchCampaignsSuccess,
    fetchCampaignsFailure,
    setCurrentCampaign,
    createCampaignSuccess,
    updateCampaign,
    setFilters,
    addContribution
} = campaignSlice.actions;

export default campaignSlice.reducer;
