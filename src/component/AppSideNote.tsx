import React, {useState} from 'react';
import loadable from '@loadable/component';
import {useTheme} from '@mui/material/styles';
import {SxProps} from '@mui/material'

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

import {useAppDispatch, useAppSelector} from 'app/hooks';
import {selectIsDarkMode, selectShowAppSideNote, setShowAppSideNote} from 'app/appSlice';

import screencast from 'static/screencast.mp4';

const SideNote = loadable(() => import(/* webpackPrefetch: true */ 'component/SideNote'));

/**
 * The side note about the app
 */
export default function AppSideNote(): JSX.Element {
    const [showVideo, setShowVideo] = useState(false);
    const showAppSideNote = useAppSelector(selectShowAppSideNote);
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    return (
        <Box className="metadata-app-side-note">
            <SideNote
                isOpen={showAppSideNote}
                onClose={() => dispatch(setShowAppSideNote(false))}
            >
                <AppBar sx={styles.header}>
                    A side note about Metadata
                </AppBar>
                <Box
                    sx={{
                        ...styles.noteBox,
                        ...(isDarkMode && {
                            color: theme.palette.secondary.contrastText,
                            background: theme.palette.secondary.dark
                        })
                    }}
                >
                    Bookkeeper got a facelift
                    <SentimentSatisfiedAltIcon sx={styles.faceIcon}/>
                    And now it is called Metadata.
                    After very long haitus since 2016, the original Bookkeeper code became obsolete.
                    And Bookkeeper's original functionality was no longer possible due to changes to the platform's
                    integration policy.
                    <p/>
                    Enjoy this short
                    <Tooltip title="Click to watch a short demo video" placement="bottom-end">
                        <Link onClick={() => setShowVideo(true)} sx={styles.videoLink}>demo video</Link>
                    </Tooltip>
                    to experience Bookkeeper 1.0
                    <p/>
                    Also due to further policy changes Metadata will no longer be going live
                    <SentimentDissatisfiedIcon sx={styles.faceIcon}/>
                    <p/>
                    The only allowed use case for user_posts is to create physical or digital books of your own timeline
                    or to share the timeline on social apps. The only other allowed use of the permission would be as a
                    parental monitoring app to analyze a user’s posts for potential safety and well being for users that
                    are under 18 years old.
                    <p/>
                    Please enjoy this mock version with data collected from my own posts while developing locally
                    <p/>
                    <Box sx={styles.projectBox}>
                        Metadata is a selfish project that is entirely dedicated to the author's own personal growth.
                        <p/>
                        The code can be found
                        <Tooltip title="Click view the code on github" placement="top-end">
                            <Link
                                sx={styles.codeLink}
                                href="https://github.com/doubleoevan/bookkeeper"
                                target="_blank"
                            >
                                here
                            </Link>
                        </Tooltip>
                    </Box>
                </Box>
            </SideNote>
            <Dialog open={showVideo} onBackdropClick={() => setShowVideo(false)}>
                <video src={screencast} controls autoPlay>
                    Your browser does not support the <code>video</code> element.
                </video>
            </Dialog>
        </Box>
    );
};

const styles: { [key: string]: SxProps } = {
    header: {
        padding: '8px',
        position: 'relative',
        textAlign: 'center'
    },
    noteBox: {
        padding: '8px',
        height: '100%',
        overflow: 'scroll',
    },
    faceIcon: {
        margin: '0 6px',
        fontSize: 'inherit',
        verticalAlign: 'text-top'
    },
    videoLink: {
        margin: '0 6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    projectBox: {
        display: {
            xs: 'block',
            sm: 'none'
        }
    },
    codeLink: {
        margin: '0 6px'
    }
}
