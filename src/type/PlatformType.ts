import {SvgIcon} from '@mui/material'

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TwitterIcon from '@mui/icons-material/Twitter';

// import FacebookPlatformService from 'service/FacebookPlatformService';
import MockPlatformService from 'service/MockPlatformService';
import {LIMIT_POSTS_FACEBOOK, LIMIT_POSTS_INSTAGRAM, LIMIT_POSTS_TWITTER, LIMIT_POSTS_WHATSAPP} from 'app/config';
import PlatformService from 'service/PlatformService';
import BaseType from 'type/BaseType';

/**
 * The platform types enumeration
 */
export default class PlatformType extends BaseType<PlatformType>() {
    public static readonly Facebook = new PlatformType({
        icon: FacebookIcon,
        limitPosts: LIMIT_POSTS_FACEBOOK,
        // service: FacebookPlatformService.getInstance(), // TODO: enable after API access is approved
        service: MockPlatformService.getInstance('Facebook')
    });
    public static readonly Instagram = new PlatformType({
        icon: InstagramIcon,
        limitPosts: LIMIT_POSTS_INSTAGRAM
    });
    public static readonly WhatsApp = new PlatformType({
        icon: WhatsAppIcon,
        limitPosts: LIMIT_POSTS_WHATSAPP
    });
    public static readonly Twitter = new PlatformType({
        icon: TwitterIcon,
        limitPosts: LIMIT_POSTS_TWITTER
    });
    private static _ = PlatformType.toEnumeration();

    public readonly icon: typeof SvgIcon;
    public readonly limitPosts: number;
    public readonly service?: PlatformService;

    private constructor({icon, service, limitPosts}: {
        icon: typeof SvgIcon;
        limitPosts: number;
        service?: PlatformService
    }) {
        super();
        this.icon = icon;
        this.service = service;
        this.limitPosts = limitPosts;
    }
}
