// functions
import keyMirror from 'keymirror';

// define domain specific configuration constants
const config = {

  // dev configuration constants
  'localhost': {
    clientId: '1542610659388850'
  },

  // production configuration constants
  'mybookkeeper.io': {
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

  // media constants
  SCREENCAST_URL: 'https://video.fsnc1-1.fna.fbcdn.net/hvideo-xtf1/v/t43.1792-2/12500075_1239316996084526_1345139756_n.mp4?efg=eyJybHIiOjE1MDAsInJsYSI6MTQzNSwidmVuY29kZV90YWciOiJzdmVfaGQifQ%3D%3D&rl=1500&vabr=328&oh=3f78ad10864979d26732e11f982d4a9b&oe=56A464A5',
  SCREENCAST_IMAGE_URL: 'https://scontent.fsnc1-1.fna.fbcdn.net/hvthumb-xft1/v/t15.0-10/12497069_561129304049855_1553818616_n.jpg?oh=e042c3926b7991dee03cdee1d839806c&oe=56FBFB1C',
  CONTACT_EMAIL: 'bookkeeper.contact@gmail.com',

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
