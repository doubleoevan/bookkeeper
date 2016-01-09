import fetch from 'cross-fetch';
import dayjs from 'dayjs';

import PlatformService, {Post, PostReaction, User} from 'service/PlatformService';
import PlatformType from 'type/PlatformType';
import ReactionType, {Reaction} from 'type/ReactionType';

import {fbApiDomain, fbApiVersion, LIMIT_POSTS_FACEBOOK, storageKeys} from 'app/config';

const API_URL = `${fbApiDomain}/${fbApiVersion}`;

type LocationResponse = {
    latitude: number,
    longitude: number,
}

type PlaceResponse = {
    id: string,
    name: string,
    location?: LocationResponse,
}

type PostResponse = {
    id: string,
    message?: string,
    story: string,
    picture?: string,
    full_picture?: string,
    link?: string,
    permalink_url?: string,
    created_time: number,
    place?: PlaceResponse,
}

type ReactionResponseCount = {
    summary?: {
        total_count?: number;
    };
}

type ReactionResponse = {
    [type in Reaction]: ReactionResponseCount
} & {
    id: string;
};

type BatchRequest = {
    method: string,
    relative_url: string,
}

/**
 * The Facebook implementation of the platform service API
 */
export default class FacebookPlatformService implements PlatformService {
    private static instance: FacebookPlatformService;

    static getInstance(): FacebookPlatformService {
        if (!this.instance) {
            this.instance = new FacebookPlatformService();
        }
        return this.instance;
    }

    public setUserToken = (token: string): void => {
        return window?.localStorage?.setItem(storageKeys.FB_USER_TOKEN, token);
    }

    public getUserToken = (): string | null => {
        return window?.localStorage?.getItem(storageKeys.FB_USER_TOKEN);
    }

    public removeUserToken = (): void => {
        window?.localStorage?.removeItem(storageKeys.FB_USER_TOKEN);
    }

    public getUser = async (): Promise<User> => {
        const userToken = this.getUserToken();
        const userUrl = `${API_URL}/me?fields=id,name,picture&access_token=${userToken}`;
        const request = await fetch(userUrl);
        const {id, name, picture} = await request.json();
        return {id, name, picture: picture.data.url, platform: PlatformType.Facebook.type};
    }

    public getPosts = async (userId: string): Promise<Array<Post>> => {
        const platform = PlatformType.Facebook.type;
        const userToken = this.getUserToken();
        const postsUrl = `${API_URL}/${userId}?fields=posts.limit(${LIMIT_POSTS_FACEBOOK}){story,message,picture,created_time,place,link,full_picture,permalink_url}&access_token=${userToken}`;
        const request = await fetch(postsUrl);
        const response = await request.json();
        const posts = response.posts?.data?.map(({
              id,
              message,
              story,
              picture,
              full_picture,
              link,
              permalink_url,
              created_time,
              place
          }: PostResponse) => {
            return {
                id,
                message,
                story,
                picture: picture || full_picture,
                link: link || permalink_url,
                createdTime: dayjs(created_time).unix(),
                placeId: place?.id,
                placeName: place?.name,
                latitude: place?.location?.latitude,
                longitude: place?.location?.longitude,
                reactions: [],
                platform
            };
        }) || [];
        return posts;
    }

    public getReactions = async (posts: Array<Post>): Promise<Array<PostReaction>> => {
        const requests: Array<BatchRequest> = [];
        const fields = this.getReactionRequestFields();
        posts.forEach(({id}: Post) => {
            const request: BatchRequest = {
                method: 'GET',
                relative_url: `${id}?fields=${fields}`
            };
            requests.push(request);
        });
        const reactions: Array<PostReaction> = [];
        const userToken = this.getUserToken();
        const responses = await this.getBatchResponse(`${API_URL}/me?access_token=${userToken}`, requests) as Array<ReactionResponse>;
        responses.forEach(({id: postId, ...response}) => {
            for (const reactionType of ReactionType) {
                const reaction = response[reactionType.type as Reaction];
                const count = reaction?.summary?.total_count;
                count && reactions.push({postId, type: reactionType.type, count});
            }
        });
        return reactions;
    }

    private getReactionRequestFields = (): string => {
        const fieldTypes: Array<string> = [];
        for (const reactionType of ReactionType) {
            fieldTypes.push(`reactions.type(${reactionType.type.toUpperCase()}).limit(0).summary(total_count).as(${reactionType.type})`);
        }
        return fieldTypes.join(',');
    }

    private getBatchResponse = async (url: string, batch: Array<BatchRequest>): Promise<Array<Object>> => {
        const request = await fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({batch})
        });
        const response = await request.json();
        return response.map(({body}: { body: string }) => JSON.parse(body));
    }
}
