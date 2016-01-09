import React from 'react';
import {SxProps} from '@mui/material'

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Navigation from 'component/Navigation';

import {useAppDispatch, useAppSelector} from 'app/hooks';
import {selectShowSideMenu, setShowSideMenu} from 'app/appSlice';


/**
 * The responsive side menu on the left which collapses to a button icon on narrow screens
 */
export default function SideMenu(): JSX.Element {
    const showSideMenu = useAppSelector(selectShowSideMenu);
    const dispatch = useAppDispatch();

    return (
        <Box
            className="metadata-side-menu"
            component="menu"
            sx={styles.menuBox}
        >
            <Drawer
                sx={styles.sliderMenu}
                variant="temporary"
                open={showSideMenu}
                onClose={() => dispatch(setShowSideMenu(false))}
                ModalProps={{
                    keepMounted: true // Better open performance on mobile.
                }}
            >
                <Navigation/>
            </Drawer>
            <Drawer
                sx={styles.fixedMenu}
                variant="permanent"
                open
            >
                <Navigation/>
            </Drawer>
        </Box>
    );
};

export const WIDTH_SIDE_MENU = 240;
const styles: { [key: string]: SxProps } = {
    menuBox: {
        width: {
            sm: WIDTH_SIDE_MENU
        },
        flexShrink: {
            sm: 0
        }
    },
    sliderMenu: {
        display: {
            xs: 'block',
            sm: 'none'
        },
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: WIDTH_SIDE_MENU
        }
    },
    fixedMenu: {
        display: {
            xs: 'none',
            sm: 'block'
        },
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: WIDTH_SIDE_MENU
        }
    }
}
