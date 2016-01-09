// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

/**
 * Privacy shows the privacy policy view.
 */
export default React.createClass({

  displayName: 'Privacy',

  mixins: [PureRenderMixin],

  render() {
    // show the privacy policy
    return (
        <div className="row">
          <div className="col s12">
            <h5>Privacy Policy</h5>
            <p className="caption">
              We cannot see any of the data you send or receive from this application. period.
            </p>
          </div>
        </div>
    );
  }
});
