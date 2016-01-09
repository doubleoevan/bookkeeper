import * as React from 'react';
import {useLogin as useFacebookLogin} from 'react-facebook';
import {useTheme} from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import {User} from 'service/PlatformService';
import MockPlatformService from 'service/MockPlatformService';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {selectIsDarkMode, setShowLoginMenu, setShowRefreshSideNote} from 'app/appSlice';
import {fetchPosts, fetchReactions, fetchUser, selectUsers, setIsLoggingIn} from 'app/platformSlice';
import PlatformType from 'type/PlatformType';

/**
 * The login menu for all app platforms
 */
export default function LoginMenu() {
    const {login: facebookLogin} = useFacebookLogin();
    const users: { [platform: string]: User; } = useAppSelector(selectUsers);
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const theme = useTheme();

    async function onLogin(platformType: PlatformType) {
        const platformService = platformType.service;
        if (!platformService) {
            console.warn(`${platformType} service is not implemented yet`);
            return;
        }
        dispatch(setShowLoginMenu(false));
        dispatch(setIsLoggingIn(true));
        try {
            if (platformService instanceof MockPlatformService) {
                platformService.setUserToken('mockUserToken');
            } else {
                switch (platformType) {
                    case PlatformType.Facebook:
                        const facebookResponse = await facebookLogin({
                            scope: 'public_profile,user_posts'
                        });
                        platformService.setUserToken(facebookResponse.authResponse.accessToken);
                        break;
                    default:
                        console.warn(`${platformType} login is not implemented yet`);
                        dispatch(setIsLoggingIn(false));
                        return;
                }
            }
            const platform = platformType.type;
            await dispatch(fetchUser(platform));
            await dispatch(fetchPosts(platform));
            await dispatch(fetchReactions(platform));
        } catch (error) {
            console.error(error);
            dispatch(setIsLoggingIn(false));
            dispatch(setShowRefreshSideNote(true));
        }
    }

    return (
        <Paper
            className="metadata-login-menu"
            sx={{
                ...(isDarkMode && {
                    color: theme.palette.secondary.contrastText,
                    background: theme.palette.secondary.dark
                })
            }}
        >
            <ClickAwayListener onClickAway={() => dispatch(setShowLoginMenu(false))}>
                <MenuList>
                    {PlatformType.map((platform: PlatformType, index: number) => {
                        const tooltip = platform.service ? `Log into ${platform}` : `${platform} will be coming soon...`
                        const user = users[platform.type];
                        const PlatformIcon = platform.icon;
                        return (
                            <Tooltip title={tooltip} placement="left" key={index}>
                                <MenuItem onClick={() => onLogin(platform)} disabled={!!user}>
                                    <ListItemIcon>
                                        <PlatformIcon/>
                                    </ListItemIcon>
                                    <ListItemText>{`${platform}`}</ListItemText>
                                </MenuItem>
                            </Tooltip>
                        );
                    })}
                </MenuList>
            </ClickAwayListener>
        </Paper>
    );
}
