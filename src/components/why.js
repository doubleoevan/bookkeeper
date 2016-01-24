// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

// components
import { LoadingContainer, LoadedContainer } from './loading-status';
import { LoggedOutContainer, LoggedInContainer } from './login-status';
import { LoginButtonContainer } from './login-button';
import { Screenshots } from './screenshots';
import { Link } from 'react-router';
import Preloader from './preloader';
import Screencast from './screencast';

// functions
import { tooltipProps } from '../helpers/tooltip';

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
            <div className="col s6 valign center">
              {/* about message */}
              <h5>How Come?</h5>
              <p className="caption">
                Because people like you!<br/>
                And you deserve to know it.
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
                {/* who link */}
                <LoggedInContainer>
                  <Link {...tooltipProps('Click to see who liked your posts')} to="/who">
                    See who liked you the most.
                  </Link>
                </LoggedInContainer>
              </LoadedContainer>
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
