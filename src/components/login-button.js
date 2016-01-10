// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// functions
import { tooltipProps } from '../helpers/tooltip';
import { connect } from 'react-redux';
import * as actions from '../app/actions';

/**
 * LoginButton shows a facebook login button.
 */
export const LoginButton = React.createClass({

  displayName: 'LoginButton',

  propTypes: {
    logIn: PropTypes.func.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin],

  render() {
    // assign variables from the props
    const { logIn } = this.props;

    // show the login button
    return (
        <a {...tooltipProps('Track your Facebook posts with Bookkeeper', 'right')}
            className="btn-large z-depth-2 waves-effect waves-light"
            onClick={logIn}
            onMouseUp={this.hideTooltips}
            ref="root">
          <i className="material-icons left">thumb_up</i>
          Log in with Facebook
        </a>
    );
  }
});

// return the component with actions attached to the store
export const LoginButtonContainer = connect(
    null,
    actions
)(LoginButton);
