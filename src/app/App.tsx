import React from 'react';
import {Provider} from 'react-redux';
import {FacebookProvider} from 'react-facebook';

import {fbApiVersion, fbAppId} from 'app/config';
import {store} from 'app/store';

import Router from 'app/Router';

/**
 * The app to embed in a DOM node
 */
export default function App(): JSX.Element {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <FacebookProvider appId={fbAppId} version={fbApiVersion}>
                    <Router/>
                </FacebookProvider>
            </Provider>
        </React.StrictMode>
    );
}
