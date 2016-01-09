import {
    AngryReactionIcon,
    CareReactionIcon,
    HaHaReactionIcon,
    LikeReactionIcon,
    LoveReactionIcon,
    SadReactionIcon,
    WowReactionIcon
} from 'component/ReactionIcon';

import BaseType from 'type/BaseType';

export type Reaction = 'Like' | 'Love' | 'Care' | 'Wow' | 'Haha' | 'Sad' | 'Angry';

/**
 * The reaction types enumeration
 */
export default class ReactionType extends BaseType<ReactionType> {
    public static readonly Like = new ReactionType({
        icon: LikeReactionIcon,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.35)',
        imageOffset: -63
    });
    public static readonly Love = new ReactionType({
        icon: LoveReactionIcon,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.35)',
        imageOffset: -103
    });
    public static readonly Care = new ReactionType({
        icon: CareReactionIcon,
        borderColor: 'rgba(255, 192, 203, 1)',
        backgroundColor: 'rgba(255, 192, 203, 0.35)',
        imageOffset: -143
    });
    public static readonly Wow = new ReactionType({
        icon: WowReactionIcon,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.35)',
        imageOffset: -223
    });
    public static readonly HaHa = new ReactionType({
        icon: HaHaReactionIcon,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.35)',
        imageOffset: -183
    });
    public static readonly Sad = new ReactionType({
        icon: SadReactionIcon,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.35)',
        imageOffset: -263
    });
    public static readonly Angry = new ReactionType({
        icon: AngryReactionIcon,
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.35)',
        imageOffset: -303
    });
    private static _ = ReactionType.toEnumeration();

    public readonly icon: () => JSX.Element;
    public readonly borderColor: string;
    public readonly backgroundColor: string;
    public readonly imageOffset: number;

    private constructor({icon, borderColor, backgroundColor, imageOffset}: {
        icon: () => JSX.Element;
        borderColor: string;
        backgroundColor: string;
        imageOffset: number;
    }) {
        super();
        this.icon = icon;
        this.borderColor = borderColor;
        this.backgroundColor = backgroundColor;
        this.imageOffset = imageOffset;
    }
}
