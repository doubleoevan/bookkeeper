// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

// components
import { LoginButtonContainer } from '../components/login-button';
import { Screenshots } from '../components/screenshots';

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
          {/* login form */}
          <div className="row">
            <div className="col s12">
              <p className="caption">
                Sure they like you, but do they <i>like</i> like you?<br/>
                Let's find out...
              </p>

              {/* login button */}
              <LoginButtonContainer/>
            </div>
          </div>

          {/* screenshots */}
          <Screenshots/>
        </div>
    );
  }
});
