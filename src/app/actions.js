// functions
import fetch from 'isomorphic-fetch';
import keyMirror from 'keymirror';
import camelize from 'camelize';
import moment from 'moment';
import { createAction } from 'redux-actions';
import { normalize, Schema, arrayOf } from 'normalizr';

// constants
import {
    clientId,
    apiDomain,
    apiVersion,
    storageKeys,
    postTypes,
    LIMIT_UPDATES_FETCHED,
    LIMIT_PHOTOS_FETCHED,
    LIMIT_VIDEOS_FETCHED
} from './config';
const API_URL = `${apiDomain}/${apiVersion}`;

// define action type constants
export const actionTypes = keyMirror({
  'LOAD_API': null,
  'LOG_IN': null,
  'LOG_OUT': null,
  'SET_LOADING': null,
  'SET_LOGIN_REQUIRED': null,
  'SET_PATH': null,
  'SET_USER': null,
  'ADD_LIKES': null,
  'ADD_POSTS': null,
  'REMOVE_LIKES': null,
  'REMOVE_POSTS': null
});

/* eslint-disable no-use-before-define */
// define actions that do not require preprocessing
const setLoginRequired = createAction(actionTypes.SET_LOGIN_REQUIRED);
const setLoading = createAction(actionTypes.SET_LOADING);
const setPath = createAction(actionTypes.SET_PATH);
const setUser = createAction(actionTypes.SET_USER);
const addPosts = createAction(actionTypes.ADD_POSTS);
const addLikes = createAction(actionTypes.ADD_LIKES);
const removePosts = createAction(actionTypes.REMOVE_POSTS);
const removeLikes = createAction(actionTypes.REMOVE_LIKES);

const loadApi = createAction(actionTypes.LOAD_API, () => {
  // initialize the facebook api after its loaded
  window.fbAsyncInit = () => {
    window.FB.init({
      appId: clientId,
      xfbml: false,
      version: apiVersion
    });
  };

  // load the facebook api asynchronously
  /* eslint-disable func-names */
  (function (d, s, id) {
    if (d.getElementById(id)) {
      return;
    }
    const js = d.createElement(s);
    js.id = id;
    js.src = '//connect.facebook.net/en_US/sdk.js';
    const fjs = d.getElementById('app');
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  /* eslint-enable func-names */
});

const logIn = () => {
  // dispatch a facebook login request
  return dispatch => {
    window.FB.login(response => {
      const authResponse = response.authResponse;
      if (authResponse) {
        // save the user token to local storage then dispatch a user info request
        const userToken = authResponse.accessToken;
        const localStorage = window.localStorage;
        localStorage.setItem(storageKeys.USER_TOKEN, userToken);
        dispatch(fetchUser());
      }
    }, {
      // set app permissions
      scope: 'public_profile,user_posts,user_photos,user_videos'
    });

    // return a login action type
    return dispatch(createAction(actionTypes.LOG_IN)());
  };
};

const logOut = createAction(actionTypes.LOG_OUT, () => {
  // remove the user token from local storage to log out
  const localStorage = window.localStorage;
  localStorage.removeItem(storageKeys.USER_TOKEN);

  // set the loading state to false
  return dispatch => {
    dispatch(setLoading(false));
  };
});

const fetchUser = () => {
  // log out immediately if there is no user token
  const localStorage = window.localStorage;
  const userToken = localStorage.getItem(storageKeys.USER_TOKEN);
  if (!userToken) {
    return logOut();
  }

  // set the loading state to true
  return dispatch => {
    dispatch(setLoading(true));

    // request the user data
    const userUrl = `${API_URL}/me?access_token=${userToken}&fields=id,name,picture,link,posts.limit(${LIMIT_UPDATES_FETCHED}),photos.limit(${LIMIT_PHOTOS_FETCHED}).type(uploaded),videos.limit(${LIMIT_VIDEOS_FETCHED}).type(uploaded)`;
    return fetch(userUrl).then(userResponse => {
      // log out immediately if the user token is no longer valid
      if (userResponse.status >= 400) {
        return dispatch(logOut());
      }

      // normalize the user response data
      return userResponse.json().then(responseData => {
        const updateSchema = new Schema('posts');
        const photoSchema = new Schema('photos');
        const videoSchema = new Schema('videos');
        const userData = normalize(camelize(responseData), {
          picture: {
            data: {}
          },
          posts: {
            data: arrayOf(updateSchema)
          },
          photos: {
            data: arrayOf(photoSchema)
          },
          videos: {
            data: arrayOf(videoSchema)
          }
        });

        // clear the previously fetched user data
        dispatch(removePosts());
        dispatch(removeLikes());

        // fetch post data for user entities
        const { posts, photos, videos } = userData.entities;
        dispatch(fetchPosts(posts, postTypes.TYPE_UPDATE));
        dispatch(fetchPosts(photos, postTypes.TYPE_PHOTO));
        dispatch(fetchPosts(videos, postTypes.TYPE_VIDEO));

        // define the user object
        const { name, picture, link } = userData.result;
        const user = {
          name,
          link,
          picture: picture.data.url
        };

        // set the user object on the state
        dispatch(setUser(user));
        dispatch(setLoading(false));
      });
    });
  };
};

const fetchPosts = (postEntities = {}, postType) => {
  // fetch meta data for posts entities
  return dispatch => {
    return fetchPostsData(postEntities, postType).then(postsData => {
      // add post likes to the state
      const { posts, likes } = postsData;
      dispatch(addLikes(likes));

      // add posts to the state
      return dispatch(addPosts(posts));
    });
  };
};

const fetchPostsData = (postsData, postType) => {
  // log out immediately if there is no user token
  const localStorage = window.localStorage;
  const userToken = localStorage.getItem(storageKeys.USER_TOKEN);
  if (!userToken) {
    return logOut();
  }

  // set the api fields to fetch based on the post type
  let fields;
  const { TYPE_UPDATE, TYPE_PHOTO, TYPE_VIDEO } = postTypes;
  switch (postType) {
    case TYPE_UPDATE:
      fields = ['story', 'message', 'picture', 'created_time', 'place', 'link'];
      break;
    case TYPE_PHOTO:
      fields = ['name', 'picture', 'created_time', 'place', 'link'];
      break;
    case TYPE_VIDEO:
      fields = ['title', 'picture', 'created_time', 'place', 'permalink_url', 'source'];
      break;
    default:
      fields = [];
  }

  // initialize the post and like requests
  const postRequests = [];
  const likeRequests = [];
  for (const postId of Object.keys(postsData)) {
    // initialize a post request
    const postUrl = `${API_URL}/${postId}?access_token=${userToken}&fields=${fields.join(',')}`;
    postRequests.push(fetch(postUrl).then(fetchJson));

    // initialize a like request
    const likeUrl = `${API_URL}/${postId}/likes?access_token=${userToken}&fields=name,picture,link&summary=true`;
    likeRequests.push(fetch(likeUrl).then(fetchJson).then(like => {
      // set the post id on the like response
      like.postId = postId;
      return like;
    }));
  }

  // parse and add post responses to a collection of post objects
  const posts = {};
  return Promise.all(postRequests).then(postResponses => {
    for (const postResponse of postResponses) {
      // normalize each post response
      const post = normalize(camelize(postResponse), {}).result;
      const { story, message, name, title, link, permalinkUrl, source } = post;
      post.title = title || story || message || name;
      const postLink = link || permalinkUrl || source;
      post.link = toAbsoluteUrl(postLink);
      post.type = postType;

      // set the created time on the post as a unix timestamp
      const createdTime = post.createdTime;
      if (createdTime) {
        post.createdTime = moment(createdTime).unix();
      }

      // set the place id on the post
      const { place } = post;
      if (place) {
        post.place = renameId(place, 'placeId');
      }

      // set the post id and add the post to the collection
      renameId(post, 'postId');
      posts[post.postId] = post;
    }

    // save like responses to a collection of like objects
    const likeSchema = new Schema('likes');
    return Promise.all(likeRequests).then(likeResponses => {
      const likes = {};
      for (const likeResponse of likeResponses) {
        // normalize each like response
        const likeData = normalize(camelize(likeResponse), {
          data: arrayOf(likeSchema)
        });
        const { postId, summary } = likeData.result;

        // set the total like count on the post
        const post = posts[postId];
        post.likeCount = summary.totalCount;
        const postLikes = likeData.entities.likes || {};

        // add all post likes to the like collection
        for (const userId of Object.keys(postLikes)) {
          const like = postLikes[userId];
          renameId(like, 'userId');
          like.postId = postId;
          like.picture = like.picture.data.url;
          const likeId = `${postId}:${userId}`;
          likes[likeId] = like;
        }
      }

      // return the post and like collections
      return {
        posts,
        likes
      };
    });
  });
};

const toAbsoluteUrl = url => {
  // prepend the url with an absolute prefix if necessary
  if (url && !url.startsWith('http')) {
    return `http://facebook.com/${url}`;
  }
  return url;
};

const renameId = (object, newId) => {
  // rename the id field to a more descriptive field name then delete the id field
  object[newId] = object.id;
  delete object.id;
  return object;
};

// define a promise to return json from the fetch response instead of creating a callback function in a loop
const fetchJson = response => {
  return response.json();
};

/**
 * Actions exports redux actions that can be dispatched to reducers that apply changes to the global state
 */
module.exports = {
  // redux action types
  actionTypes,

  // redux actions
  setLoginRequired,
  setLoading,
  setPath,
  setUser,
  addPosts,
  addLikes,
  removePosts,
  removeLikes,
  loadApi,
  logIn,
  logOut,
  fetchUser
};
