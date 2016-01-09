import React from 'react';
import {SxProps} from '@mui/material'

import InfoIcon from '@mui/icons-material/InfoOutlined';
import FixedWidthTooltip from 'component/FixedWidthTooltip';

import {User} from 'service/PlatformService';
import PlatformType from 'type/PlatformType';
import {useAppSelector} from 'app/hooks';
import {selectUsers} from 'app/platformSlice';

/**
 * The tooltip for charts
 */
export default function ChartTooltip(): JSX.Element {
    const users: { [platform: string]: User; } = useAppSelector(selectUsers);

    // set the tooltip title
    const dataMessages: Array<string> = [];
    Object.values(users).forEach((user: User) => {
        const platformType: PlatformType = PlatformType.fromType(user.platform);
        dataMessages.push(`your last ${platformType.limitPosts} ${user.platform} posts`);
    });
    const title = `Click on the legend and the chart to interact. Data is derived from ${dataMessages.join(' and ')}.`;

    // show the chart information in a fixed width tooltip
    return (
        <FixedWidthTooltip
            title={title}
            width={350}
            placement="bottom-end"
        >
            <InfoIcon sx={styles.infoIcon}/>
        </FixedWidthTooltip>
    );
};

const styles: { [key: string]: SxProps } = {
    infoIcon: {
        verticalAlign: 'text-bottom'
    }
}
