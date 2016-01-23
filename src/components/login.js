// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

// components
import { LoginButtonContainer } from '../components/login-button';
import { Screenshots } from '../components/screenshots';
import Screencast from '../components/screencast';

/**
 * Login shows the global login form.
 */
export default React.createClass({

  displayName: 'Login',

  mixins: [PureRenderMixin],

  render() {
    // show the login form
    return (
        <div>
          <div className="login-form row valign-wrapper">
            {/* login form */}
            <div className="col s6 valign">
              <p className="caption">
                Sure they like you, but do they <i>like</i> like you?<br/>
                Let's find out...
              </p>

              {/* login button */}
              <LoginButtonContainer/>
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
