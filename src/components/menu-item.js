// libraries
import React, { PropTypes } from 'react';
import classNames from 'classnames';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// components
import { Link } from 'react-router';

// functions
import { tooltipProps } from '../helpers/tooltip';
import { connect } from 'react-redux';
import * as actions from '../app/actions';

/**
 * MenuItem shows a menu item that is active if it matches the current path.
 */
export const MenuItem = React.createClass({

  displayName: 'MenuItem',

  propTypes: {
    currentPath: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin],

  render() {
    // assign variables from the props and set the menu item classes
    const { currentPath, path, icon, text, tooltip } = this.props;
    const classes = classNames('menu-item', {
      'active': path === currentPath
    });

    // show the menu item
    return (
        <li className={classes}>
          <Link {...tooltipProps(tooltip)} to={path}>
            <i className="navigation-icon material-icons left">{icon}</i> {text}
          </Link>
        </li>
    );
  }
});

// map the global state to component props
const mapStateToProps = state => {
  return {
    currentPath: state.get('path')
  };
};

// return the component with props attached to the state and actions attached to the store
export const MenuItemContainer = connect(
    mapStateToProps,
    actions
)(MenuItem);
