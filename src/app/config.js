// functions
import keyMirror from 'keymirror';

// define domain specific configuration constants
const config = {

  // dev configuration constants
  'localhost': {
    clientId: '1542610659388850'
  },

  // production configuration constants
  'bookkeeper.surge.sh': {
    clientId: '1542610236055559'
  }
};
const domainConfig = config[window.location.hostname] || {};

// define local storage keys
const storageKeys = {
  'USER_TOKEN': ':user-token'
};

// define post type keys
const postTypes = keyMirror({
  'TYPE_UPDATE': null,
  'TYPE_PHOTO': null,
  'TYPE_VIDEO': null
});

/**
 * AppConfig exports application configuration constants
 */
module.exports = {
  // api constants
  clientId: domainConfig.clientId,
  apiVersion: 'v2.5',
  apiDomain: 'https://graph.facebook.com',

  // local storage keys
  storageKeys,

  // facebook post types
  postTypes,

  // export fetch limit constants
  LIMIT_UPDATES_FETCHED: 100,
  LIMIT_PHOTOS_FETCHED: 100,
  LIMIT_VIDEOS_FETCHED: 100,

  // export display limit constants
  LIMIT_USERS_DISPLAYED: 10,
  LIMIT_POSTS_DISPLAYED: 10,
  LIMIT_MONTHS_DISPLAYED: 10
};
