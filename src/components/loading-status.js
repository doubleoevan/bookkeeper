// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';
import ModalMixin from '../mixins/modals';

// functions
import { connect } from 'react-redux';

/**
 * LoadingStatus conditionally shows content based on the state's isLoading flag.
 */
export const LoadingStatus = React.createClass({

  displayName: 'LoadingStatus',

  propTypes: {
    isLoading: PropTypes.bool.isRequired,
    requireLoading: PropTypes.bool.isRequired,
    requireLoaded: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  },

  mixins: [PureRenderMixin, TooltipMixin, ModalMixin],

  getDefaultProps() {
    return {
      requireLoading: false,
      requireLoaded: false
    };
  },

  render() {
    // assign variables from the props
    const { isLoading, requireLoading, requireLoaded, children } = this.props;

    // if loading is required then only show content when the isLoading flag is true
    if (isLoading && requireLoading) {
      return <div>{children}</div>;
    }

    // if not loading is required then only show content when the isLoading flag is false
    if (!isLoading && requireLoaded) {
      return <div>{children}</div>;
    }
    return null;
  }
});

/**
 * LoadingContainer only shows content when the isLoading flag is true.
 */
export const LoadingContainer = connect(state => {
  return {
    isLoading: state.get('isLoading'),
    requireLoading: true
  };
})(LoadingStatus);

/**
 * LoadedContainer only shows content when the isLoading flag is false.
 */
export const LoadedContainer = connect(state => {
  return {
    isLoading: state.get('isLoading'),
    requireLoaded: true
  };
})(LoadingStatus);
