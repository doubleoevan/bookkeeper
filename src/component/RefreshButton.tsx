import React from 'react';
import {SxProps} from '@mui/material'

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import {User} from 'service/PlatformService';
import PlatformType from 'type/PlatformType';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {setShowRefreshSideNote} from 'app/appSlice';
import {
    fetchPosts,
    fetchReactions,
    selectIsLoadingPosts,
    selectIsLoadingReactions,
    selectUsers
} from 'app/platformSlice';

/**
 *  The platform data refresh button for the app
 */
export default function RefreshButton(): JSX.Element {
    const users: { [platform: string]: User; } = useAppSelector(selectUsers);
    const isLoadingPosts = useAppSelector(selectIsLoadingPosts);
    const isLoadingReactions = useAppSelector(selectIsLoadingReactions);
    const isLoading = isLoadingPosts || isLoadingReactions;
    const dispatch = useAppDispatch();

    async function onRefresh() {
        // fetch posts and reactions for each logged in platform user
        Object.values(users).forEach(async (user: User) => {
            const platformType = PlatformType.fromType(user.platform);
            try {
                const platform = platformType.type;
                await dispatch(fetchPosts(platform));
                await dispatch(fetchReactions(platform));
            } catch (error: any) {
                console.error(error);
            }
        });
    }

    return (
        <Box className="metadata-refresh-button" sx={styles.buttonBox}>
            <>
                {isLoading ? (
                    <CircularProgress/>
                ) : (
                    <>
                        <Tooltip title="Refresh your data" placement="bottom-end">
                            <Button onClick={onRefresh} variant="contained">Refresh</Button>
                        </Tooltip>
                        <Tooltip title="Side note about data refresh" placement="bottom-end">
                            <IconButton
                                sx={styles.button}
                                onClick={() => dispatch(setShowRefreshSideNote(true))}
                                aria-label="open refresh data side note"
                            >
                                <InfoIcon/>
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </>
        </Box>
    );
};

const styles: { [key: string]: SxProps } = {
    buttonBox: {
        float: 'right'
    },
    button: {
        display: {
            xs: 'none',
            sm: 'inline-flex'
        }
    }
}
