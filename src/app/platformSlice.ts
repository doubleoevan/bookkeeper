import {ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Post, PostReaction, User} from 'service/PlatformService';
import PlatformType from 'type/PlatformType';

import {AppDispatch, RootState} from 'app/store';

export interface PlatformState {
    isLoggingIn: boolean,
    isLoadingPosts: boolean,
    isLoadingReactions: boolean,
    users: { [platform: string]: User },
    posts: { [platformPostId: string]: Post },
}

const initialState: PlatformState = {
    isLoggingIn: false,
    isLoadingPosts: false,
    isLoadingReactions: false,
    users: {},
    posts: {},
};

type PlatformReactions = {
    platform: string,
    reactions: Array<PostReaction>,
}

export const fetchUser = createAsyncThunk<User, string, {
    dispatch: AppDispatch,
    state: RootState,
    rejectValue: string,
}>(
    'data/fetchUser',
    async (platform: string, {rejectWithValue}) => {
        try {
            const platformType = PlatformType.fromType(platform);
            const user = await platformType!.service?.getUser();
            return user as User;
        } catch (error) {
            return rejectWithValue(platform);
        }
    }
);

export const fetchPosts = createAsyncThunk<Array<Post>, string, {
    dispatch: AppDispatch,
    state: RootState,
    rejectValue: string
}>(
    'data/fetchPosts',
    async (platform: string, {getState, rejectWithValue}) => {
        const {platform: platformState} = getState();
        try {
            const user = platformState.users[platform];
            const platformType = PlatformType.fromType(platform);
            const posts = await platformType!.service?.getPosts(user.id);
            return posts as Array<Post>;
        } catch (error) {
            return rejectWithValue(platform);
        }
    }
);

export const fetchReactions = createAsyncThunk<PlatformReactions, string, {
    dispatch: AppDispatch,
    state: RootState,
    rejectValue: string
}>(
    'data/fetchReactions',
    async (platform: string, {getState, rejectWithValue}) => {
        const {platform: platformState} = getState();
        try {
            const posts = Object.values(platformState.posts).filter((post: Post) => post.platform === platform);
            const platformType = PlatformType.fromType(platform);
            const reactions = await platformType!.service?.getReactions(posts);
            return {platform, reactions} as PlatformReactions;
        } catch (error) {
            return rejectWithValue(platform);
        }
    }
);

const removeUserToken = (state: PlatformState, action: PayloadAction<string | undefined>) => {
    // remove the user token for a failed request
    const platform = action.payload!;
    const platformType = PlatformType.fromType(platform);
    platformType!.service?.removeUserToken();
}

const toPlatformPostId = (platform: string, postId: string) => `${platform}:${postId}`;

/**
 * The redux store slice for platform data
 */
export const platformSlice = createSlice({
    name: 'platform',
    initialState,
    reducers: {
        setIsLoggingIn(state: PlatformState, action: PayloadAction<boolean>) {
            state.isLoggingIn = action.payload;
        },
        logout(state: PlatformState, action: PayloadAction<User>) {
            //  remove the user and their posts
            const user = action.payload;
            const platformType = PlatformType.fromType(user.platform);
            platformType!.service?.removeUserToken();
            delete state.users[user.platform];
            Object.entries(state.posts).forEach(([key, post]: [key: string, post: Post]) => {
                if (post.platform === user.platform) {
                    delete state.posts[key];
                }
            });
            return state;
        },
        clearPlatformData() {
            // remove all local storage tokens and reset to the initial state
            for (const platformType of PlatformType) {
                platformType.service?.removeUserToken();
            }
            return initialState;
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<any>) => {
        builder
            // fetch user reducers
            .addCase(fetchUser.pending, (state: PlatformState) => {
                state.isLoggingIn = true;
            })
            .addCase(fetchUser.fulfilled, (state: PlatformState, action) => {
                // save the user to the state
                const user = action.payload;
                state.users[user.platform] = user;
                state.isLoggingIn = false;
            })
            .addCase(fetchUser.rejected, (state: PlatformState, action) => {
                removeUserToken(state, action);
                state.isLoggingIn = false;
            })

            // fetch posts reducers
            .addCase(fetchPosts.pending, (state: PlatformState) => {
                state.isLoadingPosts = true;
            })
            .addCase(fetchPosts.fulfilled, (state: PlatformState, action) => {
                // save the posts to the state
                state.posts = {};
                action.payload.forEach((post: Post) => {
                    state.posts[toPlatformPostId(post.platform, post.id)] = post;
                });
                state.isLoadingPosts = false;
            })
            .addCase(fetchPosts.rejected, (state: PlatformState, action) => {
                removeUserToken(state, action);
                state.isLoadingPosts = false;
            })

            // fetch reactions reducers
            .addCase(fetchReactions.pending, (state: PlatformState) => {
                state.isLoadingReactions = true;
            })
            .addCase(fetchReactions.fulfilled, (state: PlatformState, action) => {
                // clear the previous post reactions for this platform
                const {platform, reactions} = action.payload;
                Object.keys(state.posts).forEach((postId: string) => {
                    const post = state.posts[postId];
                    post.reactions = post.platform === platform ? [] : post.reactions;
                });

                // map the reactions to their posts
                reactions.forEach((reaction: PostReaction) => {
                    const post = state.posts[toPlatformPostId(platform, reaction.postId)];
                    post && post.reactions.push(reaction);
                });
                state.isLoadingReactions = false;
            })
            .addCase(fetchReactions.rejected, (state: PlatformState, action) => {
                removeUserToken(state, action);
                state.isLoadingReactions = false;
            })
    }
});

export const selectUsers = (state: RootState) => state.platform.users;
export const selectPosts = (state: RootState) => state.platform.posts;
export const selectIsLoggingIn = (state: RootState) => state.platform.isLoggingIn;
export const selectIsLoadingPosts = (state: RootState) => state.platform.isLoadingPosts;
export const selectIsLoadingReactions = (state: RootState) => state.platform.isLoadingReactions;
export const {setIsLoggingIn, logout, clearPlatformData} = platformSlice.actions;
export default platformSlice.reducer;
