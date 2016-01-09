// libraries
import React from 'react';
import ReactDOM from 'react-dom';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// components
import { IndexLink } from 'react-router';
import { AvatarContainer } from './avatar';
import SideMenu from './side-menu';

// functions
import { tooltipProps } from '../helpers/tooltip';
import { createSlider } from '../helpers/slider';
import { connect } from 'react-redux';
import * as actions from '../app/actions';

/**
 * Header displays the global header.
 */
export const Header = React.createClass({

  displayName: 'Header',

  mixins: [PureRenderMixin, TooltipMixin],

  componentDidMount() {
    // initialize the collapsible side menu
    const menuButton = ReactDOM.findDOMNode(this.refs.menuButton);
    createSlider(menuButton);
  },

  render() {
    // show the header
    return (
        <div>
          {/* header */}
          <nav className="top-nav">
            <div className="row">
              <div className="col s12">

                {/* login status */}
                <div className="login-status right">
                  <AvatarContainer/>
                </div>

                {/* menu button */}
                <a className="button-collapse hide-on-large-only"
                   data-activates="collapsible-side-menu"
                   ref="menuButton">
                  <i className="material-icons">menu</i>
                </a>

                {/* app title */}
                <h1 className="header center-on-med-and-down">
                  <IndexLink {...tooltipProps('Track your Facebook posts with Bookkeeper')} to="/">
                    Bookkeeper
                  </IndexLink>
                </h1>

                {/* app description */}
                <h4 className="tag-line light text-lighten-4 center-on-med-and-down">
                  Track your Facebook posts. Feel great about yourself.
                </h4>
              </div>
            </div>
          </nav>

          {/* fixed and collapsible side menus */}
          <SideMenu className="side-nav fixed hide-on-med-and-down"/>
          <SideMenu className="side-nav z-depth-2 fixed hide-on-large-only" id="collapsible-side-menu"/>
        </div>
    );
  }
});

// return the component wth actions attached to the store
export const HeaderContainer = connect(
    null,
    actions
)(Header);
