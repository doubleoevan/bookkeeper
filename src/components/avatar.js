// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';
import ModalMixin from '../mixins/modals';

// components
import Preloader from './preloader';
import { LoggedInContainer, LoggedOutContainer } from './login-status';
import { LoadingContainer, LoadedContainer } from './loading-status';

// functions
import { tooltipProps } from '../helpers/tooltip';
import { connect } from 'react-redux';
import * as actions from '../app/actions';

/**
 * Avatar displays the global user avatar.
 */
export const Avatar = React.createClass({

  displayName: 'Avatar',

  propTypes: {
    name: PropTypes.string,
    picture: PropTypes.string,
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin, ModalMixin],

  render() {
    // assign variables from the props
    const { name, picture, logIn, logOut } = this.props;

    // show the avatar
    return (
        <div className="section">

          {/* loading display */}
          <LoadingContainer>
            <Preloader classes="small"/>
          </LoadingContainer>

          {/* loaded display */}
          <LoadedContainer>
            {/* logged in display */}
            <LoggedInContainer>
              {/* user picture */}
              <a className="modal-trigger"
                 href="#logout-modal">
                <img {...tooltipProps(`Logged in as ${name}`, 'left')}
                    className="user-picture responsive-img circle" src={picture}/>
              </a>
            </LoggedInContainer>

            {/* logged out display */}
            <LoggedOutContainer>
              <h6>
                <a {...tooltipProps('Log in with Facebook', 'left')}
                    onClick={logIn}
                    onMouseUp={this.hideTooltips}>
                  Log in
                </a>
              </h6>
            </LoggedOutContainer>
          </LoadedContainer>

          {/* log out modal */}
          <div id="logout-modal" className="logout-modal modal">
            <div className="modal-content">
              <div className="row">
                <div className="col">
                  <img className="user-picture responsive-img circle"
                       src={picture}/>
                </div>
                <div className="col">
                  <h5>{name}</h5>
                </div>
                <div className="col right">
                  <a className="btn-large z-depth-2 waves-effect waves-light modal-action modal-close">
                    Close
                  </a>
                </div>
                <div className="col right">
                  <a className="btn-large z-depth-2 waves-effect waves-light modal-action modal-close"
                     onClick={logOut}>
                    Log out
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
});

// map the global state to component props
const mapStateToProps = state => {
  return {
    name: state.getIn(['user', 'name']),
    picture: state.getIn(['user', 'picture'])
  };
};

// return the component wth props attached to the state and actions attached to the store
export const AvatarContainer = connect(
    mapStateToProps,
    actions
)(Avatar);
