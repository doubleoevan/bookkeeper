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
import Screencast from './screencast';

/**
 * Why shows the about us view.
 */
export default React.createClass({

  displayName: 'Why',

  mixins: [PureRenderMixin],

  render() {
    return (
        <div>
          <div className="about-message row valign-wrapper">
            <div className="col s6 valign">
              {/* about message */}
              <div className="left">
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

            {/* screencast */}
            <div className="col s6">
              <div className="right">
                <Screencast/>
              </div>
            </div>
          </div>

          {/* screenshots */}
          <Screenshots/>
        </div>
    );
  }
});
