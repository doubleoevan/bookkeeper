// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

// components
import { HeaderContainer } from './header';
import { LoadingContainer, LoadedContainer } from './loading-status';
import { LoggedInContainer, LoggedOutContainer } from './login-status';
import { FooterContainer } from './footer';
import Preloader from '../components/preloader';
import Login from '../components/login';
import FastClick from 'react-fastclick-alt';

// functions
import { connect } from 'react-redux';
import * as actions from '../app/actions';

/**
 * Layout wraps view content in a global layout.
 */
export const Layout = React.createClass({

  displayName: 'Layout',

  propTypes: {
    isLoginRequired: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      isLoginRequired: true
    };
  },

  renderLayoutContent() {
    // always show the content if a login is not required
    const { isLoginRequired, children } = this.props;
    if (!isLoginRequired) {
      return <div>{children}</div>;
    }

    // show the content or a login view if login is required
    return (
        <div>
          {/* loading display */}
          <LoadingContainer>
            <div className="center">
              <Preloader classes="big"/>
            </div>
          </LoadingContainer>

          {/* loaded display */}
          <LoadedContainer>
            {/* logged out display */}
            <LoggedOutContainer>
              <Login/>
            </LoggedOutContainer>

            {/* logged in display */}
            <LoggedInContainer>{children}</LoggedInContainer>
          </LoadedContainer>
        </div>
    );
  },

  render() {
    // show the content wrapped in a global layout without the 300ms click delay on mobile
    const { isLoginRequired, children } = this.props;
    return (
        <FastClick>
          {/* header */}
          <header>
            <HeaderContainer/>
          </header>

          {/* main */}
          <main>
            <div className="row">
              <div className="col s12">
                {this.renderLayoutContent(isLoginRequired, children)}
              </div>
            </div>
          </main>

          {/* footer */}
          <footer className="page-footer">
            <FooterContainer/>
          </footer>
        </FastClick>
    );
  }
});

// map the global state to component props
const mapStateToProps = state => {
  return {
    isLoginRequired: state.get('isLoginRequired')
  };
};

// return the component with props attached to the state and actions attached to the store
export const LayoutContainer = connect(
    mapStateToProps,
    actions
)(Layout);
