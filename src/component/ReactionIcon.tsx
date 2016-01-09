import React, {CSSProperties} from 'react';

import ReactionType from 'type/ReactionType';

import reactionsSrc from 'static/reactions.png';

export const LikeReactionIcon = (): JSX.Element => <ReactionIcon reaction={ReactionType.Like}/>;
export const LoveReactionIcon = (): JSX.Element => <ReactionIcon reaction={ReactionType.Love}/>;
export const CareReactionIcon = (): JSX.Element => <ReactionIcon reaction={ReactionType.Care}/>;
export const WowReactionIcon = (): JSX.Element => <ReactionIcon reaction={ReactionType.Wow}/>;
export const HaHaReactionIcon = (): JSX.Element => <ReactionIcon reaction={ReactionType.HaHa}/>;
export const SadReactionIcon = (): JSX.Element => <ReactionIcon reaction={ReactionType.Sad}/>;
export const AngryReactionIcon = (): JSX.Element => <ReactionIcon reaction={ReactionType.Angry}/>;

/**
 * The icon for a reaction
 */
const ReactionIcon = ({reaction}: { reaction: ReactionType; }): JSX.Element => {
    // return the reaction image mapped to its sprite offset
    return (
        <div
            style={{
                background: `url("${reactionsSrc}") no-repeat`,
                backgroundPosition: `${reaction.imageOffset}px`,
                ...styles.icon
            }}
        />
    );
};

const styles: { [key: string]: CSSProperties } = {
    icon: {
        width: '40px',
        height: '40px',
        backgroundSize: '400px',
        display: 'inline-block'
    }
}
