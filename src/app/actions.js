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
    LIMIT_LIKES_FETCHED,
    LIMIT_UPDATES_FETCHED,
    LIMIT_PHOTOS_FETCHED,
    LIMIT_VIDEOS_FETCHED
} from './config';
const API_URL = `${apiDomain}/${apiVersion}`;
const RESPONSE_BAD_REQUEST = 400;

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
  const userToken = getUserToken();
  if (!userToken) {
    return logOut();
  }

  // set the loading state to true
  return dispatch => {
    dispatch(setLoading(true));

    // request the user data
    const { TYPE_UPDATE, TYPE_PHOTO, TYPE_VIDEO } = postTypes;
    const updatesField = toEntitiesField(TYPE_UPDATE);
    const photosField = toEntitiesField(TYPE_PHOTO);
    const videosField = toEntitiesField(TYPE_VIDEO);
    const userUrl = `${API_URL}/me?access_token=${userToken}&fields=id,name,picture,link,${updatesField},${photosField},${videosField}`;
    return fetch(userUrl).then(userResponse => {
      // log out immediately if the user token is no longer valid
      if (userResponse.status >= RESPONSE_BAD_REQUEST) {
        return dispatch(logOut());
      }

      // normalize the user response data
      return userResponse.json().then(responseData => {
        const updateSchema = new Schema('updates');
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

        // add posts for user data entities
        const { updates, photos, videos } = userData.entities;
        dispatch(addEntities(updates, TYPE_UPDATE));
        dispatch(addEntities(photos, TYPE_PHOTO));
        dispatch(addEntities(videos, TYPE_VIDEO));

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

const toEntitiesField = postType => {
  // return the fields string for a post type
  const { TYPE_UPDATE, TYPE_PHOTO, TYPE_VIDEO } = postTypes;
  switch (postType) {
    case TYPE_UPDATE:
      const updateFields = ['story', 'message', 'picture', 'created_time', 'place', 'link'].join(',');
      return `posts.limit(${LIMIT_UPDATES_FETCHED}){${updateFields}}`;
    case TYPE_PHOTO:
      const photoFields = ['name', 'picture', 'created_time', 'place', 'link'].join(',');
      return `photos.limit(${LIMIT_PHOTOS_FETCHED}).type(uploaded){${photoFields}}`;
    case TYPE_VIDEO:
      const videoFields = ['title', 'picture', 'created_time', 'place', 'permalink_url', 'source'].join(',');
      return `videos.limit(${LIMIT_VIDEOS_FETCHED}).type(uploaded){${videoFields}}`;
    default:
      return '';
  }
};

const addEntities = (entities = {}, postType) => {
  // add posts and likes for user data entities
  return dispatch => {
    // request and add post likes to the state
    const posts = toPosts(entities, postType);
    const likeRequests = toLikeRequests(posts);
    fetchLikes(likeRequests, posts, dispatch);

    // parse and add posts to the state
    return dispatch(addPosts(posts));
  };
};

const toPosts = (entities, postType) => {
  // convert user entities data into posts
  const posts = {};
  for (const postId of Object.keys(entities)) {
    // normalize each post response
    const post = entities[postId];
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
  return posts;
};

const toLikeRequests = (posts = {}) => {
  // log out immediately if there is no user token
  const userToken = getUserToken();
  if (!userToken) {
    return logOut();
  }

  // initialize the like requests
  const likeRequests = [];
  for (const postId of Object.keys(posts)) {
    // add a like request for each post
    const likeUrl = `${API_URL}/${postId}/likes?access_token=${userToken}&fields=name,picture,link&summary=true&limit=${LIMIT_LIKES_FETCHED}`;
    likeRequests.push(toLikeRequest(likeUrl, postId));
  }
  return likeRequests;
};

const fetchLikes = (likeRequests = [], posts = {}, dispatch) => {
  // save like responses to a collection of like objects
  Promise.all(likeRequests).then(likeResponses => {
    const likes = {};
    const likeSchema = new Schema('likes');
    const pagedLikeRequests = [];
    for (const likeResponse of likeResponses) {
      // normalize each like response
      const likeData = normalize(camelize(likeResponse), {
        data: arrayOf(likeSchema)
      });
      const { postId, summary, paging } = likeData.result;

      // add a paged like request for the post if necessary
      const pagedLikeRequest = toPagedLikeRequest(paging, postId);
      if (pagedLikeRequest) {
        pagedLikeRequests.push(pagedLikeRequest);
      }

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

    // add the current like objects to the state then fetch paged like requests if necessary
    dispatch(addLikes(likes));
    if (pagedLikeRequests.length) {
      fetchLikes(pagedLikeRequests, posts, dispatch);
    }
  });
};

const toPagedLikeRequest = (paging, postId) => {
  // return the a request for the next page of likes if necessary
  if (paging) {
    const { next } = paging;
    if (next) {
      return toLikeRequest(next, postId);
    }
  }
};

const toLikeRequest = (likeUrl, postId) => {
  // return a like request callback for an url and post id
  return fetch(likeUrl).then(fetchJson).then(like => {
    // set the post id on the like response
    like.postId = postId;
    return like;
  });
};

const getUserToken = () => {
  // return a user token from local storage
  const localStorage = window.localStorage;
  return localStorage.getItem(storageKeys.USER_TOKEN);
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
