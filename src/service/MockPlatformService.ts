import PlatformService, {Post, PostReaction, User} from 'service/PlatformService';

/**
 * The Mock implementation of the platform service API
 */
export default class MockPlatformService implements PlatformService {
    private static instances: { [platform: string]: MockPlatformService } = {};
    private readonly platform: string;
    private readonly userToken: string;

    static getInstance(platform: string): MockPlatformService {
        if (!this.instances[platform]) {
            this.instances[platform] = new MockPlatformService(platform);
        }
        return this.instances[platform];
    }

    constructor(platform: string) {
        this.platform = platform;
        this.userToken = `:mock-${this.platform}-user-token`;
    }

    public setUserToken = (token: string): void => {
        return window?.localStorage?.setItem(this.userToken, token);
    }

    public getUserToken = (): string | null => {
        return window?.localStorage?.getItem(this.userToken);
    }

    public removeUserToken = (): void => {
        window?.localStorage?.removeItem(this.userToken);
    }

    public getUser = async (): Promise<User> => {
        const user: User = await import(`mock/${this.platform.toLowerCase()}/user.json`);
        return {...user, platform: this.platform};
    }

    public getPosts = async (userId: string): Promise<Array<Post>> => {
        const posts: Array<Post> = await import(`mock/${this.platform.toLowerCase()}/posts.json`);
        return Array.from(posts).map((post: Post) => {
            return {...post, reactions: [], platform: this.platform};
        });
    }

    public getReactions = async (posts: Array<Post>): Promise<Array<PostReaction>> => {
        const reactions: Array<PostReaction> = await import(`mock/${this.platform.toLowerCase()}/reactions.json`);
        return Array.from(reactions);
    }
}
