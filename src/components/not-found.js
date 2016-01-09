// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

// components
import { Link } from 'react-router';
import { LoadingContainer, LoadedContainer } from './loading-status';
import { LoggedOutContainer } from './login-status';
import { LoginButtonContainer } from './login-button';
import { Screenshots } from './screenshots';
import Preloader from './preloader';

/**
 * NotFound shows the global 404 view.
 */
export default React.createClass({

  displayName: 'NotFound',

  mixins: [PureRenderMixin],

  render() {
    // show the not found view
    return (
        <div>
          {/* not found message */}
          <div className="row">
            <div className="col s12">
              <h5>Uh oh...</h5>
              <p className="caption">
                Looks like we've lost our way.<br/>
                Click <Link to="/">here</Link> to get back home.
              </p>

              {/* loading display */}
              <LoadingContainer>
                <Preloader/>
              </LoadingContainer>

              {/* loaded display */}
              <LoadedContainer>
                {/* login button */}
                <LoggedOutContainer>
                  <LoginButtonContainer/>
                </LoggedOutContainer>
              </LoadedContainer>
            </div>
          </div>

          {/* screenshots */}
          <Screenshots/>
        </div>
    );
  }
});
