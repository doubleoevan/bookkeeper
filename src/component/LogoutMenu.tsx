import React from 'react';
import {useTheme} from '@mui/material/styles';
import {SxProps} from '@mui/material'

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {useAppDispatch, useAppSelector} from 'app/hooks';
import {selectIsDarkMode, selectLoggingOutUser, setLoggingOutUser, setShowLogoutMenu} from 'app/appSlice';
import {logout} from 'app/platformSlice';

/**
 * The logout menu for an app platform
 */
export default function LogoutMenu(): JSX.Element {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectLoggingOutUser);
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const theme = useTheme();

    return (
        <Dialog
            className="metadata-login-menu"
            PaperProps={{
                style: {
                    ...(isDarkMode && {
                        border: `1px solid ${theme.palette.secondary.contrastText}`
                    })
                }
            }}
            open={true}
            fullWidth
        >
            <DialogContent
                sx={{
                    ...styles.content,
                    ...(isDarkMode && {
                        color: theme.palette.secondary.contrastText,
                        background: theme.palette.secondary.dark
                    })
                }}
            >
                <Toolbar disableGutters>
                    <Avatar
                        src={user!.picture}
                        sx={{
                            ...styles.avatar,
                            ...(isDarkMode && {
                                color: theme.palette.primary.main,
                                border: `1px solid ${theme.palette.secondary.contrastText}`,
                                backgroundColor: theme.palette.secondary.contrastText
                            })
                        }}
                    />
                    <Typography sx={styles.message}>
                        {user!.name} is logged in on {user!.platform}
                    </Typography>
                </Toolbar>
            </DialogContent>
            <DialogActions
                sx={{
                    ...styles.actions,
                    ...(isDarkMode && {
                        color: theme.palette.secondary.contrastText,
                        background: theme.palette.secondary.dark
                    })
                }}
            >
                <Button
                    onClick={() => {
                        dispatch(logout(user!));
                        dispatch(setShowLogoutMenu(false));
                    }}
                    variant="contained"
                >
                    Logout
                </Button>
                <Button
                    onClick={() => {
                        dispatch(setShowLogoutMenu(false));
                        dispatch(setLoggingOutUser());
                    }}
                    variant="contained"
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const styles: { [key: string]: SxProps } = {
    content: {
        paddingTop: '8px',
        paddingBottom: 0
    },
    avatar: {
        border: '1px solid #4267B2',
        backgroundColor: '#FFF'
    },
    message: {
        padding: '8px',
        flexGrow: 1
    },
    actions: {
        paddingTop: 0
    }
};
