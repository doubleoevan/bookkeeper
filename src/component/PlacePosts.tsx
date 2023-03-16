import React from 'react';
import dayjs from 'dayjs';
import loadable from '@loadable/component';
import {SxProps} from '@mui/material'
import {useTheme} from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import PlaceIcon from '@mui/icons-material/Place';

import {Post} from 'service/PlatformService';

import {useAppSelector} from 'app/hooks';
import {selectIsDarkMode} from 'app/appSlice';

const NoWrapTooltip = loadable(() => import(/* webpackPrefetch: true */ 'component/NoWrapTooltip'));

export interface PlacePostsProps {
    posts: Array<Post>,
}

/**
 * The list of posts for a place
 */
export default function PlacePosts({posts}: PlacePostsProps): JSX.Element {
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const theme = useTheme();

    return (
        <Box
            className="metadata-reaction-posts"
            component="menu"
            sx={styles.menu}
        >
            <Typography
                sx={styles.placeHeader}
                variant="h5"
            >
                <PlaceIcon sx={styles.placeIcon}/>
                <b>{posts.length}</b> posts at <b>{posts[0].placeName}</b>
                <NoWrapTooltip title="Click on your post to open it in a new tab" placement="bottom-end">
                    <InfoIcon sx={styles.infoIcon}/>
                </NoWrapTooltip>
            </Typography>
            <List
                sx={{
                    ...styles.postList,
                    ...(isDarkMode && {
                        color: theme.palette.secondary.contrastText,
                        background: theme.palette.secondary.dark
                    })
                }}
                disablePadding
            >
                <>
                    {posts.map(({picture, message, link, createdTime, platform}: Post, index: number) => {
                        const title = message ?? dayjs.unix(createdTime).format('MMM D YYYY');
                        return (
                            <ListItem
                                sx={styles.post}
                                key={index}
                                disablePadding
                            >
                                <ListItemButton
                                    sx={styles.postButton}
                                    href={link}
                                    target="_blank"
                                >
                                    <ListItemIcon sx={styles.postImageBox}>
                                        <Avatar
                                            src={picture}
                                            variant="rounded"
                                            sx={{
                                                ...styles.postImage,
                                                ...(isDarkMode && {
                                                    border: `1px solid ${theme.palette.secondary.contrastText}`,
                                                    backgroundColor: theme.palette.secondary.dark
                                                })
                                            }}
                                        >
                                            <ImageIcon
                                                sx={{
                                                    ...styles.postImagePlaceholder,
                                                    ...(isDarkMode && {
                                                        color: theme.palette.secondary.contrastText
                                                    })
                                                }}
                                            />
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={title}/>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </>
            </List>
        </Box>
    )
};

const styles: { [key: string]: SxProps } = {
    menu: {
        margin: 0,
        padding: 0
    },
    placeHeader: {
        color: '#FFF',
        backgroundColor: '#4267B2',
        padding: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'pre-wrap'
    },
    placeIcon: {
        fontSize: '40px',
        color: '#FFF',
        marginRight: 0
    },
    infoIcon: {
        marginLeft: '8px',
        color: '#FFF',
        verticalAlign: 'text-bottom',
        width: '1em',
        height: '1em'
    },
    postList: {
        maxHeight: '30vh',
        overflow: 'scroll',
        height: '100%'
    },
    post: {
        borderBottom: '1px solid #4267B2'
    },
    postButton: {
        padding: '8px'
    },
    postImageBox: {
        minWidth: 0,
        paddingRight: '8px'
    },
    postImage: {
        border: '1px solid #4267B2',
        backgroundColor: '#FFF'
    },
    postImagePlaceholder: {
        width: '100%',
        height: '100%'
    }
};
