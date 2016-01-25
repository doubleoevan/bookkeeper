// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// functions
import { tooltipProps } from '../helpers/tooltip';

/**
 * PostItem shows a post collection item.
 */
export default React.createClass({

  displayName: 'PostItem',

  propTypes: {
    post: PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
      picture: PropTypes.string
    }),
    userLink: PropTypes.string.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin],

  renderPostPicture(picture) {
    // show the post picture or a post icon by default
    if (picture) {
      return <img className="item-icon left" src={picture}/>;
    }
    return <i className="post-icon material-icons left">thumb_up</i>;
  },

  render() {
    // assign variables from the props
    const { userLink, post } = this.props;
    const { title = 'your post', link = userLink, picture } = post;

    // show the post item
    return (
        <a {...tooltipProps(`Click to open ${title}`, 'top')}
            className="collection-item"
            href={link}
            target="_blank">
          <div className="row">
            <div className="col s11">
              {this.renderPostPicture(picture)}
              <h5 className="truncate">{title}</h5>
            </div>
            <div className="col s1">
              <div className="secondary-content">
                <i className="launch-icon material-icons">launch</i>
              </div>
            </div>
          </div>
        </a>
    );
  }
});
