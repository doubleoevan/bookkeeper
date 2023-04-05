import React from 'react';
import dayjs from 'dayjs';
import {useTheme} from '@mui/material/styles';
import {SxProps} from '@mui/material'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import {Post, PostReaction} from 'service/PlatformService';
import ReactionType from 'type/ReactionType';

import {useAppSelector} from 'app/hooks';
import {selectIsDarkMode} from 'app/appSlice';

export interface PostReactionsProps {
    post: Post
}

/**
 * The list of reactions for a post
 */
export default function PostReactions({post}: PostReactionsProps): JSX.Element {
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const {picture, message, link, createdTime, platform, reactions} = post;
    const title = message ?? dayjs.unix(createdTime).format('MMM D YYYY');
    const theme = useTheme();

    return (
        <Box
            className="metadata-post-reactions"
            component="menu"
            sx={styles.menu}
        >
            <Typography
                variant="h5"
                sx={styles.postHeader}
            >
                <Avatar
                    src={picture}
                    variant="rounded"
                    sx={{
                        ...styles.postImage,
                        ...(isDarkMode && {
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
                <>{title}</>
                <Tooltip title="Click to open your post in a new tab" placement="bottom-start">
                    <Button
                        sx={styles.openPostButton}
                        href={link}
                        target="_blank"
                    >
                        <OpenInNewIcon sx={styles.openPostIcon}/>
                    </Button>
                </Tooltip>
            </Typography>
            <List
                sx={{
                    ...styles.reactionList,
                    ...(isDarkMode && {
                        color: theme.palette.secondary.contrastText,
                        background: theme.palette.secondary.dark
                    })
                }}
                disablePadding
            >
                <>
                    {reactions.map((reaction: PostReaction, index: number) => {
                        const reactionType = ReactionType.fromType(reaction.type);
                        const {type, icon: Icon, borderColor} = reactionType;
                        return (
                            <ListItem
                                sx={styles.reactionItem}
                                key={index}
                                disablePadding
                            >
                                <ListItemIcon sx={styles.reactionImage}>
                                    <Icon/>
                                </ListItemIcon>
                                <ListItemText>
                                    <b>{reaction.count}</b> <b
                                    style={{color: borderColor}}>{type}</b> reactions on {platform}
                                </ListItemText>
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
    postHeader: {
        color: '#FFF',
        backgroundColor: '#4267B2',
        padding: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'pre-wrap'
    },
    postImage: {
        margin: '8px',
        fontSize: '60px',
        width: '1em',
        height: '1em',
        border: '1px solid #FFF',
        backgroundColor: '#FFF'
    },
    postImagePlaceholder: {
        width: '100%',
        height: '100%',
    },
    openPostButton: {
        minWidth: 0
    },
    openPostIcon: {
        color: '#FFF',
        verticalAlign: 'text-bottom',
        width: '1em',
        height: '1em'
    },
    reactionList: {
        height: '100%'
    },
    reactionItem: {
        borderBottom: '1px solid #4267B2'
    },
    reactionImage: {
        minWidth: 0,
        padding: '4px 0 4px 8px'
    },
};
