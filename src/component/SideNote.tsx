import React, {ReactNode} from 'react';
import {SxProps} from '@mui/material'

import Drawer from '@mui/material/Drawer';


export interface SideNoteProps {
    isOpen: boolean,
    onClose: () => void,
    children: ReactNode,
}

/**
 * The side menu on the right
 */
export default function SideNote({isOpen, onClose, children}: SideNoteProps): JSX.Element {

    return (
        <Drawer
            className="metadata-side-note"
            sx={styles.noteBox}
            variant="temporary"
            anchor="right"
            open={isOpen}
            onClose={onClose}
            ModalProps={{
                keepMounted: true // Better open performance on mobile.
            }}
        >
            <>{children}</>
        </Drawer>
    );
};

const WIDTH_SIDE_NOTE = 240;
const styles: { [key: string]: SxProps } = {
    noteBox: {
        width: WIDTH_SIDE_NOTE,
        '& .MuiDrawer-paper': {
            width: WIDTH_SIDE_NOTE
        }
    }
}
