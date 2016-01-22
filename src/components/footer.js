// libraries
import React, { PropTypes } from 'react';

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
 * Footer shows the global footer.
 */
export const Footer = React.createClass({

  displayName: 'Footer',

  propTypes: {
    currentPath: PropTypes.string.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin],

  renderPrivacyLink() {
    // do not show the privacy link on the privacy page
    const { currentPath } = this.props;
    if (currentPath !== '/privacy') {
      return (
          <div>
            <Link {...tooltipProps('The world\'s shortest privacy policy', 'top')}
                to="/privacy">privacy policy</Link>
          </div>
      );
    }
  },

  render() {
    // show the footer
    return (
        <div className="footer-copyright center">
          <div className="row">
            <div className="col s12">
              <h5 className="app-title">Bookkeeper</h5> is a selfish project that is entirely
              dedicated to the author's own personal growth.<br/>
              The code for this application was used to explore the {' '}
              <a {...tooltipProps('A JavaScript library for building user interfaces', 'top')}
                  href="https://facebook.github.io/react/"
                  target="_blank">ReactJS
              </a> framework with the {' '}
              <a {...tooltipProps('A predictable state container for JavaScript apps.', 'top')}
                  href="http://redux.js.org/"
                  target="_blank">Redux.
              </a> It has been posted {' '}
              <a {...tooltipProps('View the code on GitHub', 'top')}
                  href="https://github.com/doubleoevan/bookkeeper"
                  target="_blank">here.
              </a>
              {this.renderPrivacyLink()}
            </div>
          </div>
        </div>
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
export const FooterContainer = connect(
    mapStateToProps,
    actions
)(Footer);
