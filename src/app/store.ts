import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';

import appSlice from 'app/appSlice';
import platformSlice from 'app/platformSlice';

/**
 * The combined redux store for all data slices
 */
export const store = configureStore({
    reducer: {
        app: appSlice,
        platform: platformSlice
    }
});

// use throughout the app for typescript definitions
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
