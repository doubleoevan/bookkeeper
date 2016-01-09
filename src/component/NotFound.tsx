import React, {CSSProperties} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import Link from '@mui/material/Link';

/**
 * The page content to display for broken paths
 */
export default function NotFound(): JSX.Element {
    return (
        <div
            className="metadata-not-found"
            style={styles.content}
        >
            Looks like we have lost our way...<br/>
            Click <Link to="/" component={RouterLink} sx={styles.homeLink}>here</Link> to get back home.
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    content: {
        textAlign: 'center',
        paddingTop: '25vh'
    },
    homeLink: {
        textDecoration: 'underline',
        fontWeight: 'bold'
    }
};
