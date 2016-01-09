import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {SxProps} from '@mui/material'
import loadable from '@loadable/component';

import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import {User} from 'service/PlatformService';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {
    selectIsDarkMode,
    selectShowAppSideNote,
    selectShowLoginMenu,
    selectShowLogoutMenu,
    selectShowRefreshSideNote,
    selectShowSideMenu,
    setIsDarkMode,
    setLoggingOutUser,
    setShowAppSideNote,
    setShowLoginMenu,
    setShowLogoutMenu,
    setShowRefreshSideNote,
    setShowSideMenu
} from 'app/appSlice';
import {selectIsLoggingIn, selectUsers} from 'app/platformSlice';

import {WIDTH_SIDE_MENU} from 'component/SideMenu';

const LoginMenu = loadable(() => import(/* webpackPrefetch: true */ 'component/LoginMenu'));
const LogoutMenu = loadable(() => import(/* webpackPrefetch: true */ 'component/LogoutMenu'));

/**
 * The header for the app
 */
export default function Header(): JSX.Element {
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const isLoggingIn = useAppSelector(selectIsLoggingIn);
    const showSideMenu = useAppSelector(selectShowSideMenu);
    const showLogoutMenu = useAppSelector(selectShowLogoutMenu);
    const showLoginMenu = useAppSelector(selectShowLoginMenu);
    const showAppSideNote = useAppSelector(selectShowAppSideNote);
    const showRefreshSideNote = useAppSelector(selectShowRefreshSideNote);
    const users: { [platform: string]: User; } = useAppSelector(selectUsers);
    const dispatch = useAppDispatch();

    return (
        <AppBar
            className="metadata-header"
            component="header"
            sx={styles.header}
        >
            <Toolbar sx={styles.toolbar}>
                <IconButton
                    sx={styles.menuButton}
                    onClick={() => dispatch(setShowSideMenu(!showSideMenu))}
                    aria-label="open menu"
                >
                    <MenuIcon sx={styles.menuButtonIcon}/>
                </IconButton>
                <Tooltip title="Dark Mode" placement="right">
                    <Switch
                        checked={isDarkMode}
                        onChange={() => dispatch(setIsDarkMode(!isDarkMode))}
                        name="loading"
                        color="secondary"
                    />
                </Tooltip>
                <Typography align="center" variant="h4" sx={styles.title}>
                    <Tooltip title="Track your posts with Metadata" placement="bottom-end">
                        <Link
                            to="/how"
                            component={RouterLink}
                            sx={styles.titleLink}
                            onClick={() => {
                                dispatch(setShowSideMenu(false));
                                dispatch(setShowAppSideNote(true));
                            }}
                        >
                            Metadata
                        </Link>
                    </Tooltip>
                    <Tooltip title="Side note about Metadata" placement="bottom-end">
                        <IconButton
                            sx={styles.infoButton}
                            onClick={() => dispatch(setShowAppSideNote(true))}
                            aria-label="open Metadata side note"
                        >
                            <InfoIcon sx={styles.infoIcon}/>
                        </IconButton>
                    </Tooltip>
                    <Typography sx={styles.heading} noWrap>
                        Track your posts. Feel great about yourself.
                    </Typography>
                </Typography>
                <>
                    {Object.entries(users).length > 0 ? Object.values(users).map((user: User, index: number) => {
                        return (
                            <Tooltip title={`Logged into ${user.platform} as ${user.name}`} placement="left"
                                     key={index}>
                                <Button
                                    sx={styles.userButton}
                                    onClick={() => {
                                        dispatch(setLoggingOutUser(user));
                                        dispatch(setShowLogoutMenu(true));
                                    }}
                                >
                                    <Avatar
                                        src={user.picture}
                                        sx={styles.userAvatar}
                                    />
                                </Button>
                            </Tooltip>
                        );
                    }) : null}
                </>
                <>
                    {isLoggingIn ? (
                        <CircularProgress sx={styles.loginSpinner} size={40}/>
                    ) : (
                        <>
                            {Object.entries(users).length > 0 ? (
                                <Tooltip title="Log in to social networks" placement="left">
                                    <Button onClick={() => dispatch(setShowLoginMenu(true))}
                                            sx={styles.loginButton}>
                                        Login
                                    </Button>
                                </Tooltip>
                            ) : (
                                <>
                                    <Tooltip
                                        title="Log in to see for yourself"
                                        placement="bottom-end"
                                        open={!(showRefreshSideNote || showAppSideNote || showLoginMenu)}
                                        arrow
                                    >
                                        <Button
                                            sx={styles.loginButton}
                                            onClick={() => dispatch(setShowLoginMenu(true))}
                                        >
                                            Login
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Side note about data refresh" placement="bottom-end">
                                        <IconButton
                                            sx={styles.refreshNoteButton}
                                            onClick={() => dispatch(setShowRefreshSideNote(true))}
                                            aria-label="open refresh data side note"
                                        >
                                            <InfoIcon sx={styles.refreshNoteIcon}/>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </>
                    )}
                </>
                <>
                    {showLoginMenu && (
                        <Box sx={styles.loginMenuBox}>
                            <LoginMenu/>
                        </Box>
                    )}
                </>
                <>{showLogoutMenu && <LogoutMenu/>}</>
            </Toolbar>
        </AppBar>
    )
};

const styles: { [key: string]: SxProps } = {
    header: {
        padding: '8px 0',
        width: {sm: `calc(100% - ${WIDTH_SIDE_MENU}px)`},
        marginLeft: {sm: `${WIDTH_SIDE_MENU}px`},
        position: 'fixed'
    },
    toolbar: {
        padding: 0
    },
    menuButton: {
        marginRight: 0,
        paddingRight: 0,
        display: {sm: 'none'}
    },
    menuButtonIcon: {
        color: '#FFF'
    },
    title: {
        padding: 0,
        flexGrow: 1
    },
    infoButton: {
        display: {
            xs: 'none',
            sm: 'inline-flex'
        }
    },
    infoIcon: {
        color: '#FFF'
    },
    heading: {
        display: {
            xs: 'none',
            sm: 'block'
        }
    },
    titleLink: {
        color: 'inherit',
        textDecoration: 'none'
    },
    userButton: {
        padding: 0,
        minWidth: 0,
        color: 'inherit'
    },
    userAvatar: {
        border: '1px solid #FFF',
        backgroundColor: '#FFF'
    },
    loginSpinner: {
        color: 'inherit'
    },
    loginButton: {
        color: '#FFF'
    },
    refreshNoteButton: {
        display: {
            xs: 'none',
            sm: 'inline-flex'
        }
    },
    refreshNoteIcon: {
        color: '#FFF'
    },
    loginMenuBox: {
        position: 'absolute',
        top: '60px',
        right: '30px'
    }
}

