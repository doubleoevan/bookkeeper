// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// components
import { MenuItemContainer } from './menu-item';
import { IndexLink } from 'react-router';

// functions
import { tooltipProps } from '../helpers/tooltip';

/**
 * Navigation shows the global navigation menu.
 */
export default React.createClass({

  displayName: 'SideMenu',


  propTypes: {
    className: PropTypes.string.isRequired,
    id: PropTypes.string
  },

  mixins: [PureRenderMixin, TooltipMixin],

  getDefaultProps() {
    return {
      className: 'side-nav fixed',
      id: 'side-menu'
    };
  },

  render() {
    // show the side menu
    return (
        <ul { ...this.props }>
          <li className="logo">
            <IndexLink {...tooltipProps('Track your Facebook posts with Bookkeeper')}
                className="brand-logo center" to="/">
              <i className="navigation-icon material-icons medium">thumb_uptrending_up</i>
            </IndexLink>
          </li>
          <MenuItemContainer icon="person_outline" key="who" path="/who" text="Who?"
                             tooltip="See who liked your posts"/>
          <MenuItemContainer icon="message" key="what" path="/what" text="What?"
                             tooltip="See your most liked posts"/>
          <MenuItemContainer icon="today" key="when" path="/when" text="When?"
                             tooltip="See when your posts were liked"/>
          <MenuItemContainer icon="language" key="where" path="/where" text="Where?"
                             tooltip="See where your posts were liked"/>
          <MenuItemContainer icon="info_outline" key="why" path="/why" text="Why?"
                             tooltip="Find out about Bookkeeper"/>
        </ul>
    );
  }
});
