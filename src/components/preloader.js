// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

/**
 * Preloader shows a loading animation.
 */
export default React.createClass({

  displayName: 'Preloader',

  propTypes: {
    classes: PropTypes.string.isRequired
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      classes: ''
    };
  },

  render() {
    // assign variables from the props
    const { classes } = this.props;

    // show the preloader
    return (
        <div className={`preloader preloader-wrapper active ${classes}`}>
          <div className="spinner-layer">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
    );
  }
});
