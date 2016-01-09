import React, {useMemo, useState} from 'react';
import loadable from '@loadable/component';
import {SxProps} from '@mui/material'

import {useJsApiLoader} from '@react-google-maps/api';
import Box from '@mui/material/Box';
import RefreshButton from 'component/RefreshButton';
import PlacePostsMap from 'component/PlacePostsMap';

import {Post} from 'service/PlatformService';
import {useAppSelector} from 'app/hooks';
import {selectPosts} from 'app/platformSlice';
import {googleMapsApiKey} from 'app/config';

const ChartTooltip = loadable(() => import(/* webpackPrefetch: true */ 'component/ChartTooltip'));
const BottomMenu = loadable(() => import(/* webpackPrefetch: true */ 'component/BottomMenu'));
const PlacePosts = loadable(() => import(/* webpackPrefetch: true */ 'component/PlacePosts'));

/**
 * The Where page content
 */
export default function Where(): JSX.Element {
    const [placePosts, setPlacePosts] = useState<Array<Post>>([]);
    const posts: { [platformPostId: string]: Post; } = useAppSelector(selectPosts);

    // show a map with the locations of your most recent posts
    const map = useMemo(() => <PlacePostsMap posts={posts} onPlaceClick={setPlacePosts}/>, [posts]);
    const {isLoaded} = useJsApiLoader({googleMapsApiKey});
    return (
        <div className="metadata-where">
            <RefreshButton/>
            Here are where your most recent post likes were...
            <ChartTooltip/>
            <>
                {isLoaded && (
                    <Box sx={styles.mapBox}>{map}</Box>
                )}
            </>
            {placePosts?.length > 0 && (
                <BottomMenu isOpen={true} onClose={() => setPlacePosts([])}>
                    <PlacePosts posts={placePosts}/>
                </BottomMenu>
            )}
        </div>
    );
};

const styles: { [key: string]: SxProps } = {
    mapBox: {
        height: {sm: '70vh', xs: '60vh'},
        width: '100%',
        padding: '24px 0'
    }
}
