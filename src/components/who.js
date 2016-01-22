// libraries
import React, { PropTypes } from 'react';
import _ from 'lodash';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';
import ModalMixin from '../mixins/modals';

// components
import VisibleItems from './visible-items';
import PostItem from './post-item';
import { RefreshButtonContainer } from './refresh-button';

// functions
import { connect } from 'react-redux';
import * as actions from '../app/actions';
import { tooltipProps, dataTooltipProps } from '../helpers/tooltip';

// constants
import { LIMIT_USERS_DISPLAYED } from '../app/config';

/**
 * Who shows the most liked users view.
 */
export const Who = React.createClass({

  displayName: 'Who',

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

  selectUser(selectedUser) {
    // set the selected user to display in the user modal
    this.setState({
      selectedUser
    });
  },

  renderUserModal(userLikeGroups) {
    // assign variables from the props and state
    const { posts, userLink } = this.props;
    const { selectedUser } = this.state;

    // assign variables from the selected user
    if (selectedUser) {
      const { userId, name, picture, link } = selectedUser;
      const likes = userLikeGroups[userId];
      const likeCount = likes.length;

      // sort the likes by date
      likes.sort((firstLike, secondLike) => {
        const firstPost = _.findWhere(posts, { postId: firstLike.postId }) || {};
        const secondPost = _.findWhere(posts, { postId: secondLike.postId }) || {};
        const firstTime = firstPost.createdTime;
        const secondTime = secondPost.createdTime;
        return secondTime - firstTime;
      });

      // set the post items
      const postItems = likes.map(like => {
        const { postId } = like;
        const post = _.findWhere(posts, { postId });
        if (post) {
          return <PostItem key={postId} post={post} userLink={userLink}/>;
        }
      });

      // show the selected user modal
      return (
          <div className="likes-modal modal bottom-sheet" id="user-modal">
            <div className="modal-content">
              {/* user header */}
              <div className="row">
                <div className="col s9">
                  <img className="header-icon responsive-img circle left" src={picture}/>
                  <h5 className="truncate">
                    Here are the {likeCount} posts that {' '}
                    <a {...tooltipProps(`Click to open ${name}'s Facebook page`, 'top')}
                        href={link}
                        target="_blank">
                      {name} <i className="material-icons tiny">launch</i>
                    </a> liked.
                  </h5>
                </div>
                <div className="close-button col s3">
                  <div className="right">
                    <a className="btn-large z-depth-2 waves-effect waves-light modal-action modal-close">
                      Close
                    </a>
                  </div>
                </div>
              </div>

              {/* user likes collection */}
              <VisibleItems className="collection card" items={postItems}/>
            </div>
          </div>
      );
    }
  },

  renderPostPicture(picture) {
    // show the post picture or a post icon by default
    if (picture) {
      return <img className="item-icon left" src={picture}/>;
    }
    return <i className="post-icon material-icons left">thumb_up</i>;
  },

  render() {
    // group likes by user and select the top groups with the most likes
    const { likes } = this.props;
    const userLikeGroups = _.groupBy(likes, 'userId');
    const likeGroups = _.sortBy(userLikeGroups, likeUsers => {
      return likeUsers.length * -1;
    }).slice(0, LIMIT_USERS_DISPLAYED);

    // set the  highest like count for a user
    const largestGroup = _.max(likeGroups, 'length');
    const highestLikeCount = largestGroup.length;

    // show the people who liked the most posts
    return (
        <div>
          <div className="row">
            {/* title */}
            <h5 {...dataTooltipProps()} className="chart-title col">
              Here are the {LIMIT_USERS_DISPLAYED} people who liked your posts the most.
            </h5>

            {/* refresh button */}
            <div className="col right">
              <RefreshButtonContainer/>
            </div>
          </div>

          {/* user histogram */}
          <div className="row">
            <div className="col s12">
              <div className="histogram">
                {likeGroups.map(likeGroup => {
                  // assign likes variables for each user
                  const user = likeGroup[0];
                  const { userId, name } = user;
                  const likeCount = likeGroup.length;
                  const width = (likeCount / highestLikeCount) * 100;
                  const selectUser = this.selectUser.bind(this, user);

                  // show the user likes bar
                  return (
                      <div key={userId}>
                        <a {...tooltipProps(`Click to see what ${name} liked...`, 'top')}
                            className="bar row modal-trigger z-depth-2 waves-effect waves-light"
                            href="#user-modal"
                            onMouseDown={selectUser}
                            onTouchStart={selectUser}
                            style={{ width: `${width}%` }}>
                          <div className="col s9">
                            <h5 className="title truncate">{name}</h5>
                          </div>
                          <div className="picture col s3">
                            <div className="center right">
                              <img className="responsive-img circle" src={user.picture}/><br/>
                              {likeCount} likes
                            </div>
                          </div>
                        </a>
                      </div>
                  );
                })}
              </div>

              {/* selected user modal */}
              {this.renderUserModal(userLikeGroups)}
            </div>
          </div>

          {/* click prompt */}
          <h6 className="center">
            Click on people to see what they liked...
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
export const WhoContainer = connect(
    mapStateToProps,
    actions
)(Who);
