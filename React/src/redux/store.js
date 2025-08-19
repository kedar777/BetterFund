import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import campaignReducer from './slices/campaignSlice';
import requestReducer from './slices/requestSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        campaigns: campaignReducer,
        requests: requestReducer,
        admin: adminReducer,
    },
});

export { store };
