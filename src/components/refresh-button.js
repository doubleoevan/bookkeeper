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
 * RefreshButton shows a refresh user data button.
 */
export const RefreshButton = React.createClass({

  displayName: 'RefreshButton',

  propTypes: {
    fetchUser: PropTypes.func.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin],

  render() {
    // assign variables from the props
    const { fetchUser } = this.props;

    // show the refresh button
    return (
        <div>
          <a {...tooltipProps('Refresh your data', 'left')}
              className="btn-large z-depth-2 waves-effect waves-light"
              onClick={fetchUser}>
            <i className="material-icons left">refresh</i> Refresh
          </a>
        </div>
    );
  }
});

// return the component with actions attached to the store
export const RefreshButtonContainer = connect(
    null,
    actions
)(RefreshButton);
