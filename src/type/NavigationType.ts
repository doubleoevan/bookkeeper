import {SvgIcon} from '@mui/material'

import ImageIcon from '@mui/icons-material/Image';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import TodayIcon from '@mui/icons-material/Today';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';

import BaseType from 'type/BaseType';

/**
 * The navigation types enumeration
 */
export default class NavigationType extends BaseType<NavigationType>() {
    public static readonly How = new NavigationType({
        label: 'How?',
        href: '/how',
        tooltip: 'See how your posts were reacted to',
        icon: AddReactionIcon
    });
    public static readonly What = new NavigationType({
        label: 'What?',
        href: '/what',
        tooltip: 'See your most reacted to posts',
        icon: ImageIcon
    });
    public static readonly When = new NavigationType({
        label: 'When?',
        href: '/when',
        tooltip: 'See when your posts were reacted to',
        icon: TodayIcon
    });
    public static readonly Where = new NavigationType({
        label: 'Where?',
        href: '/where',
        tooltip: 'See where your posts were reacted to',
        icon: MapIcon
    });
    public static readonly Why = new NavigationType({
        label: 'Why?',
        href: '/why',
        tooltip: 'Find out about Metadata',
        icon: InfoIcon
    });
    private static _ = NavigationType.toEnumeration();

    public readonly label: string;
    public readonly href: string;
    public readonly tooltip: string;
    public readonly icon: typeof SvgIcon;

    private constructor({label, href, tooltip, icon}: {
        label: string;
        href: string;
        tooltip: string;
        icon: typeof SvgIcon;
    }) {
        super();
        this.label = label;
        this.href = href;
        this.tooltip = tooltip;
        this.icon = icon;
    }
}
