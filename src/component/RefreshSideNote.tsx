import React from 'react';
import loadable from '@loadable/component';
import {useTheme} from '@mui/material/styles';
import {SxProps} from '@mui/material'

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';

import {useAppDispatch, useAppSelector} from 'app/hooks';
import {selectIsDarkMode, selectShowRefreshSideNote, setShowRefreshSideNote} from 'app/appSlice';

const SideNote = loadable(() => import(/* webpackPrefetch: true */ 'component/SideNote'));

/**
 * The side note about refreshing platform data
 */
export default function RefreshSideNote(): JSX.Element {
    const showRefreshSideNote = useAppSelector(selectShowRefreshSideNote);
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    return (
        <Box className="metadata-refresh-side-note">
            <SideNote
                isOpen={showRefreshSideNote}
                onClose={() => dispatch(setShowRefreshSideNote(false))}
            >
                <AppBar sx={styles.header}>
                    A side note about data refresh
                </AppBar>
                <Box
                    sx={{
                        ...styles.noteBox,
                        ...(isDarkMode && {
                            color: theme.palette.secondary.contrastText,
                            background: theme.palette.secondary.dark
                        })
                    }}
                >
                    We all love fresh data but sometimes an app can hit usage limits.
                    If Metadata repeatedly fails to login with a 403 error,
                    the app may be temporarily disabled due to too many requests.
                    <p/>
                    If this has happened please wait for a bit and then try logging in again.
                    We promise the issue is temporary.
                </Box>
            </SideNote>
        </Box>
    );
};

const styles: { [key: string]: SxProps } = {
    header: {
        padding: '8px',
        position: 'relative',
        textAlign: 'center'
    },
    noteBox: {
        padding: '8px',
        height: '100%'
    }
}
