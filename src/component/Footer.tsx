import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {SxProps} from '@mui/material'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';

import {WIDTH_SIDE_MENU} from 'component/SideMenu';

/**
 * The footer for the app
 */
export default function Footer(): JSX.Element {
    return (
        <AppBar
            className="metadata-footer"
            component="footer"
            sx={styles.footer}
        >
            <Box sx={styles.projectBox}>
                Metadata is a selfish project that is entirely dedicated to the author's own personal growth.
                <br/>
                The code can be found
                <Tooltip title="Click view the code on github" placement="top-end">
                    <Link
                        sx={styles.codeLink}
                        href="https://github.com/doubleoevan/bookkeeper"
                        target="_blank"
                    >
                        here
                    </Link>
                </Tooltip>
                <br/>
            </Box>
            <Tooltip title="Click view the privacy policy" placement="top-end">
                <Link
                    sx={styles.privacyLink}
                    component={RouterLink}
                    to="/privacy"
                >
                    Privacy Policy
                </Link>
            </Tooltip>
            &copy;
            <Link
                sx={styles.companyLink}
                href="https://www.facebook.com/cyberdyne.systems.inc"
                target="_blank"
            >
                Cyberdyne Systems LLC
            </Link>
        </AppBar>
    );
};

const styles: { [key: string]: SxProps } = {
    footer: {
        width: {sm: `calc(100% - ${WIDTH_SIDE_MENU}px)`},
        marginLeft: {sm: `${WIDTH_SIDE_MENU}px`},
        padding: '8px',
        top: 'auto',
        bottom: 0,
        textAlign: 'center',
        display: 'block'
    },
    codeLink: {
        color: '#FFF',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontWeight: 'bold',
        margin: '0 6px'
    },
    privacyLink: {
        color: '#FFF',
        textDecoration: 'underline',
        fontWeight: 'bold',
        margin: '0 6px'
    },
    companyLink: {
        color: '#FFF',
        textDecoration: 'underline',
        fontWeight: 'bold',
        margin: '0 6px'
    },
    projectBox: {
        display: {
            xs: 'none',
            sm: 'block'
        }
    },
}
