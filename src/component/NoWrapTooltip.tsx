import React, {ReactElement} from 'react';
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip';

export interface TooltipProps {
    title: string,
    children: ReactElement,

    // other tooltip props
    [props: string]: any,
}

/**
 * The tooltip without a max width
 */
export default function NoWrapTooltip({title, children, ...tooltipProps}: TooltipProps): JSX.Element {
    return (
        <Tooltip
            title={title}
            PopperProps={{
                sx: {
                    [`& .${tooltipClasses.tooltip}`]: {
                        maxWidth: 'none'
                    }
                }
            }}
            {...tooltipProps}
        >
            {children}
        </Tooltip>
    );
};
