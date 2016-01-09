// components
import { Map, fromJS } from 'immutable';

// functions
import { handleActions } from 'redux-actions';
import reduceReducers from 'reduce-reducers';

// constants
import { actionTypes } from './actions';

// define the default state
/* eslint-disable new-cap */
const INITIAL_STATE = Map({
  isLoading: false,
  posts: {},
  likes: {}
});

// app state change handlers
const appReducer = handleActions({

  // update the isLoading flag
  [actionTypes.SET_LOADING]: (state, action) => {
    const isLoading = action.payload;
    return state.set('isLoading', isLoading);
  },

  // update the current path
  [actionTypes.SET_PATH]: (state, action) => {
    const path = action.payload;
    return state.set('path', path);
  },

  // update the isLoginRequired flag
  [actionTypes.SET_LOGIN_REQUIRED]: (state, action) => {
    const isLoginRequired = action.payload;
    return state.set('isLoginRequired', isLoginRequired);
  },

  // reset the initial state
  [actionTypes.LOG_OUT]: state => {
    // return the initial state with the current path and isLogin required fields
    const path = state.get('path');
    const isLoginRequired = state.get('isLoginRequired');
    return INITIAL_STATE.merge(fromJS({
      path,
      isLoginRequired
    }));
  }
}, INITIAL_STATE);

// data state change handles
const dataReducer = handleActions({

  // set the user on the state
  [actionTypes.SET_USER]: (state, action) => {
    const user = fromJS(action.payload);
    return state.set('user', user);
  },

  // add posts to the state
  [actionTypes.ADD_POSTS]: (state, action) => {
    const addPosts = Map(action.payload);
    return state.update('posts', posts => posts.merge(addPosts));
  },

  // add likes to the state
  [actionTypes.ADD_LIKES]: (state, action) => {
    const addLikes = Map(action.payload);
    return state.update('likes', likes => likes.merge(addLikes));
  },

  // remove all posts from the state
  [actionTypes.REMOVE_POSTS]: state => {
    return state.set('posts', Map());
  },

  // remove all likes from the state
  [actionTypes.REMOVE_LIKES]: state => {
    return state.set('likes', Map());
  }
}, INITIAL_STATE);

/**
 * Reducers exports redux reducers that can handle redux actions and apply changes to the global state
 */
export default reduceReducers(
    appReducer,
    dataReducer
);
