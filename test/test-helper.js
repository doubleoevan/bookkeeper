// libraries
import jsdom from 'jsdom';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

// mock browser elements with jsdom
const document = jsdom.jsdom('<!doctype html><html><body></body></html>');
const window = document.defaultView;

// mock jquery for now...
window.$ = () => {
};

// set browser elements on the node.js global object
// so that they can be used without their prefix
global.document = document;
global.window = window;
Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

// plug in the chai-immutable library before any tests are run
chai.use(chaiImmutable);
