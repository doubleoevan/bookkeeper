// libraries
import React, { PropTypes } from 'react';
import _ from 'lodash';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';
import ModalMixin from '../mixins/modals';

// components
import LikeItem from './like-item';
import { RefreshButtonContainer } from './refresh-button';

// functions
import { connect } from 'react-redux';
import * as actions from '../app/actions';
import { tooltipProps, dataTooltipProps } from '../helpers/tooltip';

// constants
import { LIMIT_POSTS_DISPLAYED } from '../app/config';

/**
 * What shows the most liked posts view.
 */
export const What = React.createClass({

  displayName: 'What',

  propTypes: {
    posts: PropTypes.array.isRequired,
    likes: PropTypes.array.isRequired,
    userLink: PropTypes.string.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin, ModalMixin],

  getDefaultProps() {
    return {
      posts: [],
      likes: [],
      userLink: ''
    };
  },

  getInitialState() {
    return {};
  },

  selectPost(selectedPost) {
    // set the selected post to display in the post modal
    this.setState({
      selectedPost
    });
  },

  renderPostModal(postLikeGroups) {
    // assign variables from the props and state
    const { userLink } = this.props;
    const { selectedPost } = this.state;

    // assign variables from the selected post
    if (selectedPost) {
      const { postId, title = 'your post', link = userLink, picture } = selectedPost;
      const likes = postLikeGroups[postId];
      const likeCount = likes.length;

      // show the selected post modal
      return (
          <div className="likes-modal modal bottom-sheet" id="post-modal">
            <div className="modal-content">
              {/* post header */}
              <div className="row">
                <div className="col s9">
                  {this.renderPostPicture(picture, 'header-icon left')}
                  <h5 className="truncate">
                    Here are the {likeCount} people who liked {' '}
                    <a {...tooltipProps(`Click to open ${title} on Facebook`, 'top')}
                        href={link}
                        target="_blank">
                      {title} <i className="material-icons tiny">launch</i>
                    </a>
                  </h5>
                </div>
                <div className="close-button col s3">
                  <div className="right">
                    <a className="btn-large z-depth-2 right waves-effect waves-light modal-action modal-close">
                      Close
                    </a>
                  </div>
                </div>
              </div>

              {/* post likes collection */}
              <div className="collection card">
                {likes.map(like => {
                  const { userId } = like;
                  return <LikeItem key={userId} like={like}/>;
                })}
              </div>
            </div>
          </div>
      );
    }
  },

  renderPostPicture(picture, classes = '') {
    // show the post picture or a post icon by default
    if (picture) {
      return <img className={`responsive-img ${classes}`} src={picture}/>;
    }
    return <i className={`post-icon material-icons ${classes}`}>thumb_up</i>;
  },

  render() {
    // group likes by post and select the top groups with the most likes
    const { likes, posts } = this.props;
    const postLikeGroups = _.groupBy(likes, 'postId');
    const likeGroups = _.sortBy(postLikeGroups, postLikes => {
      return postLikes.length * -1;
    }).slice(0, LIMIT_POSTS_DISPLAYED);

    // set the highest like count for a post
    const largestLikeGroup = _.max(likeGroups, 'length');
    const highestLikeCount = largestLikeGroup.length;

    // show the most liked posts
    return (
        <div>
          {/* title */}
          <div className="row">
            <h5 {...dataTooltipProps()} className="chart-title col">
              Here are your {LIMIT_POSTS_DISPLAYED} most liked posts.
            </h5>

            {/* refresh button */}
            <div className="col right">
              <RefreshButtonContainer/>
            </div>
          </div>

          {/* posts histogram */}
          <div className="row">
            <div className="col s12">
              <div className="histogram">
                {likeGroups.map(likeGroup => {
                  // assign likes variables for each post
                  const likeCount = likeGroup.length;
                  const width = (likeCount / highestLikeCount) * 100;
                  const { postId } = likeGroup[0];
                  const post = _.findWhere(posts, { postId }) || {};
                  const { title = 'your post', picture } = post;
                  const selectPost = this.selectPost.bind(this, post);

                  // show the post likes bar
                  return (
                      <div key={postId}>
                        <a {...tooltipProps(`Click to see who liked ${title}...`, 'top')}
                            className="bar row modal-trigger z-depth-2 waves-effect waves-light"
                            href="#post-modal"
                            onMouseDown={selectPost}
                            onTouchStart={selectPost}
                            style={{ width: `${width}%` }}>
                          <div className="col s9">
                            <h5 className="title truncate">{title}</h5>
                          </div>
                          <div className="picture col s3">
                            <div className="center right">
                              {this.renderPostPicture(picture)}<br/>
                              {likeCount} likes
                            </div>
                          </div>
                        </a>
                      </div>
                  );
                })}
              </div>

              {/* selected post modal */}
              {this.renderPostModal(postLikeGroups)}
            </div>
          </div>

          {/* click prompt */}
          <h6 className="center">
            Click on posts to see who they liked them...
          </h6>
        </div>
    );
  }
});

// map the global state to component props
const mapStateToProps = state => {
  const posts = state.get('posts').toArray();
  const likes = state.get('likes').toArray();
  const userLink = state.getIn(['user', 'link']);
  return {
    posts,
    likes,
    userLink
  };
};

// return the component with props attached to the state and actions attached to the store
export const WhatContainer = connect(
    mapStateToProps,
    actions
)(What);
