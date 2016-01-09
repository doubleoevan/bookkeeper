import React from 'react';
import loadable from '@loadable/component';
import {Outlet} from 'react-router-dom';
import {SxProps} from '@mui/material'
import {createTheme, ThemeProvider} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Header from 'component/Header';
import SideMenu, {WIDTH_SIDE_MENU} from 'component/SideMenu';
import Footer from 'component/Footer';

import {useAppSelector} from 'app/hooks';
import {selectIsDarkMode} from 'app/appSlice';

const AppSideNote = loadable(() => import(/* webpackPrefetch: true */ 'component/AppSideNote'));
const RefreshSideNote = loadable(() => import(/* webpackPrefetch: true */ 'component/RefreshSideNote'));

/**
 * The layout for the app
 */
export default function Layout(): JSX.Element {
    const isDarkMode = useAppSelector(selectIsDarkMode);

    // global app theme
    const theme = createTheme({
        palette: {
            primary: {
                main: '#4267B2'
            },
            secondary: {
                main: '#FFF',
                dark: '#000',
                contrastText: '#FFF'
            }
        },
        components: {
            MuiTooltip: {
                defaultProps: {
                    enterTouchDelay: 0
                },
                styleOverrides: {
                    tooltip: {
                        fontSize: '1rem',
                        backgroundColor: '#000',
                        ...(isDarkMode && {
                            border: '1px solid #FFF'
                        })
                    },
                    arrow: {
                        color: '#000',
                        ...(isDarkMode && {
                            '&::before': {
                                border: '1px solid #FFF'
                            }
                        })
                    }
                }
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: '#4267B2'
                    }
                }
            }
        }
    });

    return (
        <Box className="metadata-layout" sx={{display: 'flex'}}>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <Header/>
                <SideMenu/>
                <Box
                    className="metadata-main"
                    component="main"
                    sx={{
                        ...styles.main,
                        ...(isDarkMode && {
                            color: theme.palette.secondary.contrastText,
                            background: theme.palette.secondary.dark
                        })
                    }}
                >
                    <Toolbar/>
                    <Outlet/>
                    <Toolbar/>
                </Box>
                <AppSideNote/>
                <RefreshSideNote/>
                <Footer/>
            </ThemeProvider>
        </Box>
    );
};

const styles: { [key: string]: SxProps } = {
    main: {
        marginLeft: {sm: `${WIDTH_SIDE_MENU}px`},
        padding: '30px 24px 24px 24px',
        width: {xs: '100%', sm: `calc(100% - ${WIDTH_SIDE_MENU}px)`},
        height: '100%',
        position: 'fixed'
    }
};
