import React, {ReactElement} from 'react';
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';

export interface TooltipProps {
    title: string,
    width: number,
    children: ReactElement,

    // other tooltip props
    [tooltipProps: string]: any,
}

/**
 * The tooltip with a fixed max width
 */
export default function FixedWidthTooltip({title, width, children, ...tooltipProps}: TooltipProps): JSX.Element {
    return (
        <Tooltip
            title={title}
            PopperProps={{
                sx: {
                    [`& .${tooltipClasses.tooltip}`]: {
                        maxWidth: width
                    }
                }
            }}
            {...tooltipProps}
        >
            {children}
        </Tooltip>
    );
};
