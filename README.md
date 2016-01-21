# Bookkeeper

[![Build Status](http://img.shields.io/travis/doubleoevan/bookkeeper/master.svg?style=flat-square)](https://travis-ci.org/doubleoevan/bookkeeper)

Track your Facebook posts with <a href="http://mybookkeeper.io/" target="_blank">Bookkeeper</a>

## Installation

Bookkeeper can be deployed locally from the command line at the project root with <a href="https://www.npmjs.com/" target="_blank">npm</a>

```
git clone https://github.com/doubleoevan/bookkeeper # download the project source
cd bookkeeper # navigate to the project root
npm install # install the project dependencies
npm start # deploy the app and launch the webpack-dev-server on http://localhost:3000
```

## Usage

Navigate to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> and log into Facebook to begin using Bookkeeper.<br/> 
Here is what you should see:
<a href="https://www.facebook.com/1542610236055559/videos/10101717213886518" target="_blank">Bookkeeper screencast</a>

## Todo

- [x] Replace autoprefixer-loader which is deprecated with postcss-loader
- [x] Set NODE_ENV = production during build for performance
- [ ] Remove Immutable.toJS from views for object sharing
- [ ] Use lodash uniqueId inside components to create modal ids
- [x] Integrate react-virtualized for performance then update the fetch limits to 100
- [ ] Convert createClass to components for performance
- [ ] Load jquery, materialize, and roboto fonts through webpack for performance and offline development
- [ ] Prerender static html to the template with ReactDOMServer.renderToStaticMarkup for performance and SEO
- [ ] Catch and handle request errors
- [ ] Add and co-locate mocha tests with components and modules
- [ ] Implement pagination for parsing "likes" responses
- [ ] Extend the platform to support "shares"
- [x] Embed Google Ads
- [ ] Redirect to https for SEO
- [ ] Extend the platform to support twitter "likes" and "shares"
- [ ] Launch a React Native version for ios
- [ ] Launch a React Native version for android