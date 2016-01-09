// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';
import ModalMixin from '../mixins/modals';

// functions
import { connect } from 'react-redux';

/**
 * LoggedInStatus conditionally shows content based on the state's isLoggedIn flag.
 */
export const LoginStatus = React.createClass({

  displayName: 'LoginStatus',

  propTypes: {
    isLoggedIn: PropTypes.bool.isRequired,
    requireLoggedIn: PropTypes.bool.isRequired,
    requireLoggedOut: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  },

  mixins: [PureRenderMixin, TooltipMixin, ModalMixin],

  getDefaultProps() {
    return {
      requireLoggedIn: false,
      requireLoggedOut: false
    };
  },

  render() {
    // assign variables from the props
    const { isLoggedIn, requireLoggedIn, requireLoggedOut, children } = this.props;

    // if loggedIn is required then only show content when the isLoggedIn flag is true
    if (isLoggedIn && requireLoggedIn) {
      return <div>{children}</div>;
    }

    // if not loggedIn is required then only show content when the isLoggedIn flag is false
    if (!isLoggedIn && requireLoggedOut) {
      return <div>{children}</div>;
    }
    return null;
  }
});

/**
 * LoggedInContainer only shows content when the isLoggedIn flag is true.
 */
export const LoggedInContainer = connect(state => {
  return {
    isLoggedIn: state.has('user'),
    requireLoggedIn: true
  };
})(LoginStatus);

/**
 * LoggedOutContainer only shows content when the isLoggedIn flag is false.
 */
export const LoggedOutContainer = connect(state => {
  return {
    isLoggedIn: state.has('user'),
    requireLoggedOut: true
  };
})(LoginStatus);
