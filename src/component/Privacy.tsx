import React, {CSSProperties} from 'react';

import Button from '@mui/material/Button';

import {useAppDispatch} from 'app/hooks';
import {clearPlatformData} from 'app/platformSlice';
import {clearAppData} from 'app/appSlice';

/**
 * The Privacy page content
 */
export default function Privacy(): JSX.Element {
    const dispatch = useAppDispatch();
    return (
        <div
            className="metadata-privacy"
            style={styles.content}
        >
            Metadata does not store or share your information. Period.
            <p/>
            Click
            <Button
                style={styles.clearButton}
                onClick={() => {
                    dispatch(clearPlatformData())
                    dispatch(clearAppData())
                }}
                variant="contained"
            >
                Here
            </Button>
            to remove all temporary data.
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    content: {
        textAlign: 'center',
        paddingTop: '25vh'
    },
    clearButton: {
        margin: '0 8px'
    }
}
