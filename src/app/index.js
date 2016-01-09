// libraries
import React from 'react';
import ReactDOM from 'react-dom';

// components
import { Router, Route, Redirect } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { LayoutContainer } from '../components/layout';
import { WhoContainer } from '../components/who';
import { WhatContainer } from '../components/what';
import { WhenContainer } from '../components/when';
import { WhereContainer } from '../components/where';
import Why from '../components/why';
import Privacy from '../components/privacy';
import NotFound from '../components/not-found';

// functions
import asyncMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { loadApi, fetchUser, setPath, setLoginRequired } from './actions';
import reducers from './reducers';

// styles
import './main.styl';

// initialize the app store
const createStoreWithMiddleware = applyMiddleware(
    asyncMiddleware, // dispatch() async functions if necessary
    loggerMiddleware() // log actions and states to the console
)(createStore);
const store = createStoreWithMiddleware(reducers);

// load the api and fetch user data
store.dispatch(loadApi());
store.dispatch(fetchUser());

// update the current path on the state
const history = createBrowserHistory();
history.listen(location => {
  const path = location.pathname;
  store.dispatch(setPath(path));
});

// update the isLoginRequired flag on the state
const requireLogin = isLoginRequired => {
  store.dispatch(setLoginRequired(isLoginRequired));
};

// define the app router
const App = (
    <Provider store={store}>
      <Router history={history}>
        <Route component={LayoutContainer}>
          <Redirect from="/" to="who"/>
          <Route component={WhoContainer} onEnter={requireLogin.bind(this, true)} path="who"/>
          <Route component={WhatContainer} onEnter={requireLogin.bind(this, true)} path="what"/>
          <Route component={WhenContainer} onEnter={requireLogin.bind(this, true)} path="when"/>
          <Route component={WhereContainer} onEnter={requireLogin.bind(this, true)} path="where"/>
          <Route component={Why} onEnter={requireLogin.bind(this, false)} path="why"/>
          <Route component={Privacy} onEnter={requireLogin.bind(this, false)} path="privacy"/>
          <Route component={NotFound} onEnter={requireLogin.bind(this, false)} path="*"/>
        </Route>
      </Router>
    </Provider>
);

// wrap the app router in a redux store provider and render it to the dom
ReactDOM.render(<Provider store={store}>{App}</Provider>, document.getElementById('app'));
export default App;
