// environment config type declaration
type EnvironmentConfig = {
    [key: string]: {
        [key: string]: any
    };
};

// environment specific configuration constants
const environment: string = process.env.NODE_ENV ?? 'development';
const environmentConfig: EnvironmentConfig = {
    // dev configuration constants
    development: {
        fbAppId: '1542610659388850',
        fbApiDomain: 'https://graph.facebook.com'
    },

    // production configuration constants
    production: {
        fbAppId: '1542610236055559',
        fbApiDomain: 'facebook-api'
    }
};
const config = environmentConfig[environment] ?? {};

/**
 * The app configuration constants
 */
// api constants
export const fbAppId = config.fbAppId;
export const fbApiDomain = config.fbApiDomain;
export const fbApiVersion = 'v16.0';
export const googleMapsApiKey = 'AIzaSyCpCzgtmaGKsaxK1PcP9_0bMmnY30JY8b8';

// fetch limit constants
export const LIMIT_POSTS_FACEBOOK = 50;
export const LIMIT_POSTS_INSTAGRAM = 50;
export const LIMIT_POSTS_WHATSAPP = 50;
export const LIMIT_POSTS_TWITTER = 50;

// local storage keys
export const storageKeys = {
    IS_DARK_MODE: ':is-dark-mode',
    FB_USER_TOKEN: ':fb-user-token'
};

// support constants
export const CONTACT_EMAIL = 'admin@bookkeeper.one';
