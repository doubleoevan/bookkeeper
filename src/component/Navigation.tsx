import React from 'react';
import {useTheme} from '@mui/material/styles';
import {SxProps} from '@mui/material'
import {Link as RouterLink, useLocation} from 'react-router-dom';

import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import {useAppDispatch, useAppSelector} from 'app/hooks';
import {selectIsDarkMode, setShowAppSideNote, setShowSideMenu} from 'app/appSlice';
import NavigationType from 'type/NavigationType';

/**
 * The navigation path list in the side menu
 */
export default function Navigation(): JSX.Element {
    const dispatch = useAppDispatch();
    const {pathname} = useLocation();
    const path = pathname === '/' ? '/how' : pathname;
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const theme = useTheme();

    return (
        <List
            className="metadata-navigation"
            component="nav"
            disablePadding
            sx={{
                ...styles.list,
                ...(isDarkMode && {
                    color: theme.palette.secondary.contrastText,
                    background: theme.palette.secondary.dark
                })
            }}
        >
            <ListItem disablePadding>
                <Tooltip title="Track your posts with Metadata" placement="right">
                    <ListItemButton
                        sx={styles.logoButton}
                        to="/how"
                        component={RouterLink}
                        onClick={() => {
                            dispatch(setShowSideMenu(false));
                            dispatch(setShowAppSideNote(true));
                        }}
                    >
                        <ListItemIcon>
                            <ThumbUpIcon sx={{fontSize: 60}}/>
                            <TrendingUpIcon sx={{fontSize: 60}}/>
                        </ListItemIcon>
                    </ListItemButton>
                </Tooltip>
            </ListItem>
            <>
                {NavigationType.map(({label, href, tooltip, icon: Icon}: NavigationType, index: number) => (
                    <ListItem
                        key={index}
                        selected={href === path}
                        sx={{
                            ...(isDarkMode && {
                                '&.Mui-selected': {
                                    backgroundColor: theme.palette.primary.main
                                }
                            })
                        }}
                        disablePadding
                    >
                        <Tooltip title={tooltip} placement="right">
                            <ListItemButton
                                to={href}
                                component={RouterLink}
                                onClick={() => dispatch(setShowSideMenu(false))}
                                sx={{
                                    ...styles.itemButton,
                                    ...(isDarkMode && {
                                        '&.Mui-focusVisible': {
                                            backgroundColor: theme.palette.primary.main
                                        },
                                        ':hover': {
                                            backgroundColor: theme.palette.primary.main
                                        }
                                    })
                                }}
                            >
                                <ListItemIcon>
                                    <Icon
                                        fontSize="large"
                                        sx={{
                                            ...(isDarkMode && {
                                                color: theme.palette.secondary.contrastText
                                            })
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={label}/>
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </>
        </List>
    )
};

const styles: { [key: string]: SxProps } = {
    list: {
        height: '100%'
    },
    logoButton: {
        paddingLeft: '80px'
    },
    itemButton: {
        paddingLeft: '40px'
    }
};
