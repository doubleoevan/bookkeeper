import React, {useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import loadable from '@loadable/component';

import Layout from 'component/Layout';
import Why from 'component/Why';
import {User} from 'service/PlatformService';
import PlatformType from 'type/PlatformType';
import {useAppDispatch, useAppSelector} from 'app/hooks';
import {setShowRefreshSideNote} from 'app/appSlice';
import {fetchPosts, fetchReactions, fetchUser, selectUsers, setIsLoggingIn} from 'app/platformSlice';

const How = loadable(() => import(/* webpackPrefetch: true */ 'component/How'));
const What = loadable(() => import(/* webpackPrefetch: true */ 'component/What'));
const When = loadable(() => import(/* webpackPrefetch: true */ 'component/When'));
const Where = loadable(() => import(/* webpackPrefetch: true */ 'component/Where'));
const Privacy = loadable(() => import(/* webpackPrefetch: true */ 'component/Privacy'));
const NotFound = loadable(() => import(/* webpackPrefetch: true */ 'component/NotFound'));

/**
 * The router for app paths
 */
export default function Router(): JSX.Element {
    const users: { [platform: string]: User; } = useAppSelector(selectUsers);
    const dispatch = useAppDispatch();

    // log back in on refresh if there is a user token without a user in the current state
    useEffect(() => {
        (async () => {
            for (const platformType of PlatformType) {
                if (platformType.service?.getUserToken()) {
                    try {
                        const platform = platformType.type;
                        dispatch(setIsLoggingIn(true));
                        await dispatch(fetchUser(platform));
                        await dispatch(fetchPosts(platform));
                        await dispatch(fetchReactions(platform));
                        dispatch(setIsLoggingIn(false));
                    } catch (error: any) {
                        console.error(error);
                        dispatch(setIsLoggingIn(false));
                        dispatch(setShowRefreshSideNote(true));
                    }
                }
            }
        })();
    }, []);

    const requireLogin = (element: JSX.Element): JSX.Element => {
        // forward to the Why content if the user is not logged in
        return Object.entries(users).length ? element : <Why/>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={requireLogin(<How/>)}/>
                    <Route path="how" element={requireLogin(<How/>)}/>
                    <Route path="what" element={requireLogin(<What/>)}/>
                    <Route path="when" element={requireLogin(<When/>)}/>
                    <Route path="where" element={requireLogin(<Where/>)}/>
                    <Route path="why" element={<Why/>}/>
                    <Route path="privacy" element={<Privacy/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
