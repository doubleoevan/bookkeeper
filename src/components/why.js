// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

// components
import { LoadingContainer, LoadedContainer } from './loading-status';
import { LoggedOutContainer } from './login-status';
import { LoginButtonContainer } from './login-button';
import { Screenshots } from './screenshots';
import Preloader from './preloader';

/**
 * Why shows the about view
 */
export default React.createClass({

  displayName: 'Why',

  mixins: [PureRenderMixin],

  render() {
    return (
        <div>
          {/* about message */}
          <div className="row">
            <div className="col s12">
              <h5>How Come?</h5>
              <p className="caption">
                Because we like you.<br/>
                And you deserve to know it!
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
