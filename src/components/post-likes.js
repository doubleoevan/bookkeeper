// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// components
import VisibleItems from './visible-items';
import LikeItem from '../components/like-item';

// functions
import { tooltipProps } from '../helpers/tooltip';

/**
 * PostLikes shows the post header and collapsible collection of likes.
 */
export default React.createClass({

  displayName: 'PostLikes',

  propTypes: {
    post: PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
      picture: PropTypes.string
    }),
    likes: PropTypes.array.isRequired,
    userLink: PropTypes.string.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin],

  getDefaultProps() {
    return {
      post: {},
      likes: [],
      userLink: ''
    };
  },

  renderPostPicture(picture) {
    // show the post picture or a post icon by default
    if (picture) {
      return <img className="item-icon left" src={picture}/>;
    }
    return <i className="post-icon material-icons left">thumb_up</i>;
  },

  render() {
    // assign variables from the props
    const { post, likes, userLink } = this.props;
    const { title = 'your post', link = userLink, picture } = post;

    // set the like items
    const likeItems = likes.map(like => {
      const { userId } = like;
      return <LikeItem key={userId} like={like}/>;
    });

    // show the post and likes collection
    return (
        <li>
          <div {...tooltipProps(`Click to see who liked ${title}`, 'top')}
              className="collapsible-header collection-item">
            <div className="row">
              <div className="col s11">
                {this.renderPostPicture(picture)}
                <h5 className="truncate">{likes.length} people liked {' '}
                  <a {...tooltipProps(`Click to open ${title}`, 'top')}
                      href={link}
                      target="_blank">
                    {title} <span className="material-icons">launch</span>
                  </a>
                </h5>
              </div>
              <div className="col s1">
                <div className="secondary-content">
                  <i className="menu-button expand-icon z-depth-2 waves-effect waves-light material-icons circle">reorder</i>
                </div>
              </div>
            </div>
          </div>

          {/* likes collection */}
          <div className="collapsible-body">
            <VisibleItems items={likeItems}/>
          </div>
        </li>
    );
  }
});
