import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {User} from 'service/PlatformService';

import {RootState} from 'app/store';
import {storageKeys} from 'app/config';

export interface AppState {
    isDarkMode: boolean,
    showSideMenu: boolean,
    showLoginMenu: boolean,
    showLogoutMenu: boolean,
    showAppSideNote: boolean,
    showRefreshSideNote: boolean,
    loggingOutUser?: User,
}

const initialState: AppState = {
    isDarkMode: window.localStorage.getItem(storageKeys.IS_DARK_MODE) === 'true',
    showSideMenu: false,
    showLoginMenu: false,
    showLogoutMenu: false,
    showAppSideNote: false,
    showRefreshSideNote: false,
};

/**
 * The redux store slice for app data
 */
export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setIsDarkMode: (state: AppState, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
            window.localStorage.setItem(storageKeys.IS_DARK_MODE, `${state.isDarkMode}`);
        },
        setShowSideMenu: (state: AppState, action: PayloadAction<boolean>) => {
            state.showSideMenu = action.payload;
        },
        setShowLoginMenu: (state: AppState, action: PayloadAction<boolean>) => {
            state.showLoginMenu = action.payload;
        },
        setShowLogoutMenu: (state: AppState, action: PayloadAction<boolean>) => {
            state.showLogoutMenu = action.payload;
        },
        setShowAppSideNote: (state: AppState, action: PayloadAction<boolean>) => {
            state.showAppSideNote = action.payload;
        },
        setShowRefreshSideNote: (state: AppState, action: PayloadAction<boolean>) => {
            state.showRefreshSideNote = action.payload;
        },
        setLoggingOutUser(state: AppState, action: PayloadAction<User | undefined>) {
            state.loggingOutUser = action.payload;
            return state;
        },
        clearAppData() {
            // remove all local storage tokens and reset to the initial state
            window.localStorage.removeItem(storageKeys.IS_DARK_MODE);
            return initialState;
        },
    }
});

export const selectIsDarkMode = (state: RootState) => state.app.isDarkMode;
export const selectShowSideMenu = (state: RootState) => state.app.showSideMenu;
export const selectShowLoginMenu = (state: RootState) => state.app.showLoginMenu;
export const selectShowLogoutMenu = (state: RootState) => state.app.showLogoutMenu;
export const selectShowAppSideNote = (state: RootState) => state.app.showAppSideNote;
export const selectShowRefreshSideNote = (state: RootState) => state.app.showRefreshSideNote;
export const selectLoggingOutUser = (state: RootState) => state.app.loggingOutUser;
export const {
    setIsDarkMode,
    setShowSideMenu,
    setShowLogoutMenu,
    setShowLoginMenu,
    setShowAppSideNote,
    setShowRefreshSideNote,
    setLoggingOutUser,
    clearAppData
} = appSlice.actions;
export default appSlice.reducer;
