// libraries
import React, { PropTypes } from 'react';
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import _ from 'lodash';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';
import ModalMixin from '../mixins/modals';
import CollapsibleMixin from '../mixins/collapsibles';

// components
import PostLikes from './post-likes';
import { RefreshButtonContainer } from './refresh-button';

// functions
import { connect } from 'react-redux';
import * as actions from '../app/actions';
import { dataTooltipProps } from '../helpers/tooltip';
import { openModal } from '../helpers/modal';

/**
 * Where shows the likes location map view.
 */
export const Where = React.createClass({

  displayName: 'Where',

  propTypes: {
    posts: PropTypes.object.isRequired,
    likes: PropTypes.array.isRequired,
    userLink: PropTypes.string.isRequired,
    chartHeight: PropTypes.number.isRequired
  },

  mixins: [PureRenderMixin, TooltipMixin, ModalMixin, CollapsibleMixin],

  getDefaultProps() {
    return {
      posts: [],
      likes: [],
      userLink: '',
      chartHeight: 400
    };
  },

  getInitialState() {
    return {};
  },

  sumPostsLikes(posts) {
    // return the total likes for a collection of posts
    return _.reduce(posts, (memo, post) => {
      const postLikes = this.toPostLikes(post);
      const likeCount = postLikes.length;
      return memo + likeCount;
    }, 0);
  },

  toPostLikes(post) {
    // return the likes for a post
    const { likes } = this.props;
    const { postId } = post;
    const postLikes = _.where(likes, { postId });
    return postLikes || [];
  },

  selectPlace(selectedPlace) {
    // set the selected place to display in the place modal then open it
    this.setState({
      selectedPlace
    }, () => {
      openModal('#place-modal');
    });
  },

  renderPlaceModal(placePostGroups) {
    // assign variables from the props and state
    const { userLink } = this.props;
    const { selectedPlace } = this.state;

    // assign variables from the selected place
    if (selectedPlace) {
      const { placeId, name } = selectedPlace;
      const placePosts = placePostGroups[placeId];
      const placeLikeCount = this.sumPostsLikes(placePosts);

      // sort the place posts by like count
      placePosts.sort((firstPost, secondPost) => {
        const firstPostLikes = this.toPostLikes(firstPost);
        const secondPostLikes = this.toPostLikes(secondPost);
        return secondPostLikes.length - firstPostLikes.length;
      });

      // set the place post likes
      const placePostLikes = placePosts.map(post => {
        const { postId } = post;
        const postLikes = this.toPostLikes(post);
        return <PostLikes key={postId} post={post} likes={postLikes} userLink={userLink}/>;
      });

      // show the selected place modal
      return (
          <div className="likes-modal modal bottom-sheet" id="place-modal">
            <div className="modal-content">
              {/* place header */}
              <div className="row">
                <div className="col s9">
                  <h5 className="truncate">
                    Here are the {placeLikeCount} likes for your {placePosts.length} posts at {name}.
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

              {/* post likes collapsibles */}
              <ul className="collection collapsible"
                  data-collapsible="accordion">
                {placePostLikes}
              </ul>
            </div>
          </div>
      );
    }
  },

  render() {
    // assign variables from the props
    let { posts } = this.props;
    const { chartHeight } = this.props;

    // filter out posts without a location or like
    posts = _.filter(posts, post => {
      const { place } = post;
      if (!(place && place.location)) {
        return false;
      }
      const postLikes = this.toPostLikes(post);
      return postLikes.length > 0;
    });

    // sort the posts by like count
    posts.sort((firstPost, secondPost) => {
      const firstPostLikes = this.toPostLikes(firstPost);
      const secondPostLikes = this.toPostLikes(secondPost);
      return secondPostLikes.length - firstPostLikes.length;
    });

    // group the posts by place
    const placePostGroups = _.groupBy(posts, post => {
      const { place } = post;
      const { placeId } = place;
      return placeId;
    });

    // show the liked post locations
    return (
        <div>
          {/* title */}
          <div className="row">
            <h5 {...dataTooltipProps()} className="chart-title col">
              Here is where your posts were liked.
            </h5>
            <div className="col right">
              <RefreshButtonContainer/>
            </div>
          </div>

          {/* map */}
          <div className="row">
            <div className="col s12">
              <div className="chart position-chart">
                <GoogleMapLoader
                    containerElement={<div className="map" style={{ height: chartHeight }}></div>}
                    googleMapElement={
                    <GoogleMap defaultCenter={{ lat: 0, lng: 0 }}
                               defaultZoom={1}>

                            {/* markers */}
                            <MarkerClusterer title={`Click to see your likes in this area`}
                                             gridSize={60}>
                                {Object.keys(placePostGroups).map(placeId => {
                                  // assign post and likes variables for each place
                                  const placePosts = placePostGroups[placeId];
                                  const place = placePosts[0].place;
                                  const placeLikeCount = this.sumPostsLikes(placePosts);
                                  const location = place.location;
                                  const { latitude, longitude } = location;
                                  const position = { lat: latitude, lng: longitude };

                                  // show the post place markers
                                  return (
                                      <Marker key={placeId}
                                              title={`Click to see your ${placeLikeCount} likes at ${place.name}`}
                                              onClick={this.selectPlace.bind(this, place)}
                                              position={position}/>
                                  );
                                })}
                            </MarkerClusterer>
                        </GoogleMap>
                    }
                />
              </div>
            </div>
          </div>

          {/* selected place modal */}
          {this.renderPlaceModal(placePostGroups)}

          {/* click prompt */}
          <h6 className="center">
            Click on markers to see the posts that people liked...
          </h6>
        </div>
    );
  }
});

// map the global state to component props
const mapStateToProps = state => {
  const posts = state.get('posts').toJS();
  const likes = state.get('likes').toArray();
  return {
    posts,
    likes
  };
};

// return the component with props attached to the state and actions attached to the store
export const WhereContainer = connect(
    mapStateToProps,
    actions
)(Where);
