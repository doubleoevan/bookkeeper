import React, {ReactElement} from 'react';
import {SxProps} from '@mui/material'
import {useTheme} from '@mui/material/styles';
import {ActiveElement, Chart, ChartEvent, Legend, LegendItem, Tooltip} from 'chart.js';

import Box from '@mui/material/Box';

Chart.register(Tooltip, Legend);

export interface ChartLayoutProps {
    children: ReactElement
}

const setCursorStyle = (event: ChartEvent, isPointer: boolean) => {
    const mouseEvent = event.native as MouseEvent;
    const element = mouseEvent?.target as HTMLCanvasElement;
    if (element) {
        element.style.cursor = isPointer ? 'pointer' : 'default';
    }
}

/**
 * The layout and theme for charts
 */
export default function ChartLayout({children}: ChartLayoutProps): JSX.Element {
    // define the chart theme
    const theme = useTheme();
    Chart.defaults.onHover = (event: ChartEvent, activeElements: ActiveElement[]) => {
        const usePointer = !!activeElements[0];
        setCursorStyle(event, usePointer);
    };
    Chart.defaults.plugins.legend.onHover = (event: ChartEvent, legendItem: LegendItem) => {
        const usePointer = !!legendItem;
        setCursorStyle(event, usePointer);
    };
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.borderColor = theme.palette.secondary.contrastText;

    // show the full-sized chart positioned in the center
    return (
        <Box
            className="metadata-chart-layout"
            sx={styles.chartBox}
        >
            {children}
        </Box>
    );
};

const styles: { [key: string]: SxProps } = {
    chartBox: {
        height: {sm: '70vh', xs: '60vh'},
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto'
    }
}
