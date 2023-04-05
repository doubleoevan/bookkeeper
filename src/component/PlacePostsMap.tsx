import React from 'react';

import {GoogleMap, Marker, MarkerClusterer} from '@react-google-maps/api';

import {Post} from 'service/PlatformService';

export interface PlacePostsMapProps {
    posts: { [key: string]: Post },
    onPlaceClick: (posts: Array<Post>) => void,
}

const ZOOM_DEFAULT = 2;

/**
 * The map with markers for post places
 */
export default function PlacePostsMap({posts, onPlaceClick}: PlacePostsMapProps): JSX.Element {
    // group posts by location
    const placePosts: { [placeId: string]: Array<Post> } = {};
    Object
        .values(posts)
        .filter((post: Post) => post.placeId && post.latitude && post.longitude)
        .forEach((post: Post) => {
            const {placeId} = post;
            if (placeId) {
                placePosts[placeId] ? placePosts[placeId].push(post) : placePosts[placeId] = [post];
            }
        });

    // return a map with post location marker clusters
    return (
        <GoogleMap
            mapContainerStyle={{width: '100%', height: '100%'}}
            center={{lat: 31.51073, lng: -96.4247}}
            zoom={ZOOM_DEFAULT}
        >
            <MarkerClusterer title="Click to see your post reactions in this area">
                {/* @ts-expect-error No overload matches this call */}
                {(clusterer) => {
                    return Object.entries(placePosts).map(([placeId, posts]: [placeId: string, posts: Array<Post>]) => {
                        const {placeName, latitude, longitude} = posts[0];
                        const markerTitle = `Click to see reactions to your ${posts.length} posts at ${placeName}`;
                        return (
                            // @ts-expect-error No overload matches this call
                            <Marker
                                title={markerTitle}
                                key={placeId}
                                position={{
                                    lat: latitude,
                                    lng: longitude
                                }}
                                clusterer={clusterer}
                                onClick={() => onPlaceClick(posts)}
                            />
                        );
                    });
                }}
            </MarkerClusterer>
        </GoogleMap>
    );
};
