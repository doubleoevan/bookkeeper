export interface User {
    id: string,
    name: string,
    picture: string,
    platform: string,
}

export interface PostReaction {
    postId: string,
    type: string,
    count: number,
}

export interface Post {
    id: string,
    message?: string,
    story?: string,
    picture: string,
    link: string,
    createdTime: number,
    placeId?: string,
    placeName?: string,
    latitude?: number,
    longitude?: number,
    reactions: Array<PostReaction>,
    platform: string,
}

/**
 * The API definition for all platform services
 */
export default interface PlatformService {
    setUserToken(token: string): void,

    getUserToken(): string | null,

    removeUserToken(): void,

    getUser(): Promise<User>,

    getPosts(userId: string): Promise<Array<Post>>,

    getReactions(posts: Array<Post>): Promise<Array<PostReaction>>,
}
