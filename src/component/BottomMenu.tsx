import React, {ReactNode} from 'react';
import Drawer from '@mui/material/Drawer';

export interface BottomMenuProps {
    isOpen: boolean,
    onClose: () => void,
    children: ReactNode,
}

/**
 * The bottom menu popup
 */
export default function BottomMenu({isOpen, onClose, children}: BottomMenuProps): JSX.Element {
    return (
        <Drawer
            variant="temporary"
            anchor="bottom"
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
