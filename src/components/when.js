// libraries
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import moment from 'moment';
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
import { tooltipProps, dataTooltipProps } from '../helpers/tooltip';
import { openModal } from '../helpers/modal';

// constants
import { LIMIT_MONTHS_DISPLAYED } from '../app/config';
const MINIMUM_LIKES_INTERVAL = 10;

/**
 * When shows the likes trended over time view.
 */
export const When = React.createClass({

  displayName: 'When',

  propTypes: {
    posts: PropTypes.array.isRequired,
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
    return {
      chartWidth: 0
    };
  },

  componentDidMount() {
    // resize the chart with the window
    this.updateChartWidth();
    window.addEventListener('resize', this.updateChartWidth);
  },

  componentDidUpdate() {
    // resize the chart with the window
    this.updateChartWidth();
  },

  updateChartWidth() {
    // update the width of the chart to render
    const chartNode = ReactDOM.findDOMNode(this.refs.chart);
    const chartWidth = parseInt(d3.select(chartNode).style('width'), 10);
    this.setState({
      chartWidth
    });
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

  toChartPaths(dayPostGroups = [], scaleWidth, scaleHeight) {
    // define the chart line path
    let linePath = '';
    const dataPoints = [];
    const days = [];
    Object.keys(dayPostGroups).map(day => {
      const dayPosts = dayPostGroups[day];
      const likeCount = this.sumPostsLikes(dayPosts);
      days.push(day);
      const dataPoint = `${scaleWidth(day)},${scaleHeight(likeCount)}`;
      dataPoints.push(dataPoint);
      linePath = `M${dataPoints.join('L')}`;
    });

    // define the chart area path
    let areaPath = '';
    if (dataPoints.length) {
      const leftPosition = scaleWidth(_.first(days));
      const rightPosition = scaleWidth(_.last(days));
      const bottomPosition = scaleHeight(0);
      const bottomRightPoint = `${rightPosition},${bottomPosition}`;
      const bottomLeftPoint = `${leftPosition},${bottomPosition}`;
      const firstPoint = _.first(dataPoints);
      const endPoints = [bottomRightPoint, bottomLeftPoint, firstPoint].join('L');
      areaPath = `${linePath}L${endPoints}Z`;
    }

    // return the chart paths
    return { linePath, areaPath };
  },

  selectDay(selectedDay) {
    // set the selected day to display in the day modal then open it
    this.setState({
      selectedDay
    }, () => {
      openModal('#day-modal');
    });
  },

  renderDayModal(dayPostGroups) {
    // assign variables from the props and state
    const { userLink } = this.props;
    const { selectedDay } = this.state;

    // assign variables from the selected day
    if (selectedDay) {
      const dayPosts = dayPostGroups[selectedDay];
      const dayLikeCount = this.sumPostsLikes(dayPosts);
      const dayDisplay = moment.unix(selectedDay).format('MMMM D, YYYY');

      // sort the posts by like count
      dayPosts.sort((firstPost, secondPost) => {
        const firstPostLikes = this.toPostLikes(firstPost);
        const secondPostLikes = this.toPostLikes(secondPost);
        return secondPostLikes.length - firstPostLikes.length;
      });

      // set the day post likes
      const dayPostLikes = dayPosts.map(post => {
        const { postId } = post;
        const postLikes = this.toPostLikes(post);
        return <PostLikes key={postId} post={post} likes={postLikes} userLink={userLink}/>;
      });

      // show the selected day modal
      return (
          <div className="likes-modal modal bottom-sheet" id="day-modal">
            <div className="modal-content">
              {/* day header */}
              <div className="row">
                <div className="col s9">
                  <h5 className="truncate">
                    Here are the {dayLikeCount} likes for your {dayPosts.length} posts on {dayDisplay}.
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

              {/* post like collections */}
              <ul className="collection collapsible"
                  data-collapsible="accordion">
                {dayPostLikes}
              </ul>

              {/* day footer */}
              <div className="row">
                <div className="close-button col s12">
                  <div className="right">
                    <a className="btn-large z-depth-2 waves-effect waves-light modal-action modal-close">
                      Close
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
      );
    }
  },

  render() {
    // set the chart dimensions
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const { chartWidth } = this.state;
    const { chartHeight } = this.props;
    const xAxisHeight = 25;
    const yAxisWidth = 45;
    const gridTop = margin.top + xAxisHeight;
    const gridRight = chartWidth - margin.right;
    const gridBottom = chartHeight - xAxisHeight - margin.top;
    const gridLeft = yAxisWidth + margin.left;

    // select the most recent posts that have likes
    const latestMoment = moment().startOf('day');
    let latestTime = latestMoment.endOf('month').unix();
    let earliestTime = latestMoment.subtract(LIMIT_MONTHS_DISPLAYED, 'months').startOf('month').unix();
    let { posts } = this.props;
    posts = _.filter(posts, post => {
      const postTime = moment.unix(post.createdTime).unix();
      if (postTime < earliestTime) {
        return false;
      }
      const postLikes = this.toPostLikes(post);
      return postLikes.length > 0;
    });

    // sort the posts by time
    posts.sort((firstPost, secondPost) => {
      const firstTime = firstPost.createdTime;
      const secondTime = secondPost.createdTime;
      return secondTime - firstTime;
    });

    // set the time range to display for the selected posts
    if (posts.length) {
      const latestPostTime = _.first(posts).createdTime;
      latestTime = moment.unix(latestPostTime).endOf('month').unix();
      const earliestPostTime = _.last(posts).createdTime;
      earliestTime = Math.max(earliestTime, moment.unix(earliestPostTime).startOf('month').unix());
    }

    // group the posts by day
    const dayPostGroups = _.groupBy(posts, post => {
      return moment.unix(post.createdTime).startOf('day').unix();
    });

    // set the highest like count for the selected posts
    const highestLikeCount = _.reduce(dayPostGroups, (memo, dayPosts) => {
      const likeCount = this.sumPostsLikes(dayPosts);
      if (likeCount > memo) {
        if (MINIMUM_LIKES_INTERVAL > likeCount) {
          return MINIMUM_LIKES_INTERVAL;
        }
        return likeCount;
      }
      return memo;
    }, 0);

    // set the x axis intervals
    const xIntervals = [];
    for (let interval = earliestTime; interval <= latestTime + 1; interval = moment.unix(interval).add(1, 'months').unix()) {
      xIntervals.push(interval);
    }

    // set the the y axis intervals
    const yIntervals = [];
    for (let interval = 0; interval <= (highestLikeCount + MINIMUM_LIKES_INTERVAL); interval += MINIMUM_LIKES_INTERVAL) {
      yIntervals.push(interval);
    }

    // define the width scaling function
    const scaleWidth = d3.time.scale()
        .domain([new Date(earliestTime), new Date(_.last(xIntervals))])
        .range([gridLeft, gridRight]);

    // define the height scaling function
    const scaleHeight = d3.scale.linear()
        .domain([0, _.last(yIntervals)])
        .range([gridBottom, gridTop]);

    // set the grid paths
    const { linePath, areaPath } = this.toChartPaths(dayPostGroups, scaleWidth, scaleHeight);

    // show the recent likes
    return (
        <div>
          {/* title */}
          <div className="row">
            <h5 {...dataTooltipProps()} className="chart-title col">
              Here are your most recent like counts.
            </h5>

            {/* refresh button */}
            <div className="col right">
              <RefreshButtonContainer/>
            </div>
          </div>

          {/* day area chart */}
          <div className="row">
            <div className="col s12">
              <div className="chart area-chart">
                <svg className="canvas"
                     height={chartHeight}
                     pointerEvents="none"
                     ref="chart">

                  {/* background */}
                  <rect className="background"
                        width={chartWidth}
                        height={chartHeight}
                        x="0"
                        y="0">
                  </rect>

                  {/* x axis labels and vertical grid lines */}
                  {xIntervals.map(interval => {
                    // assign date data for each x axis interval
                    const leftOffset = scaleWidth(interval);
                    const monthDisplay = moment.unix(interval).format('MMM');
                    const monthTooltipDisplay = moment.unix(interval).format('MMMM, YYYY');

                    // show an x axis marker and vertical grid line
                    return (
                        <g key={interval}>
                          {/* x axis label */}
                          <text {...tooltipProps(monthTooltipDisplay, 'top')}
                              className="x-axis"
                              x={leftOffset}
                              y={gridBottom + xAxisHeight}>
                            {monthDisplay}
                          </text>

                          {/* grid line */}
                          <line className="grid-line vertical-line"
                                strokeRendering="crispEdges"
                                x1={leftOffset}
                                y1={gridTop}
                                x2={leftOffset}
                                y2={gridBottom}>
                          </line>
                        </g>
                    );
                  })}

                  {/* y axis labels and horizontal grid lines */}
                  {yIntervals.map(interval => {
                    // show a y axis marker and horizontal grid line for each y axis interval
                    return (
                        <g key={interval}>
                          {/* y axis label */}
                          <text className="y-axis"
                                x={yAxisWidth}
                                y={scaleHeight(interval)}>
                            {interval || ''}
                          </text>

                          {/* horizontal grid line */}
                          <line className="grid-line horizontal-line"
                                x1={gridLeft}
                                y1={scaleHeight(interval)}
                                x2={gridRight}
                                y2={scaleHeight(interval)}>
                          </line>
                        </g>
                    );
                  })}

                  {/* area fill */}
                  <path className="area"
                        d={areaPath}>
                  </path>

                  {/* line path */}
                  <path className="line"
                        d={linePath}>
                  </path>

                  {/* vertices */}
                  {Object.keys(dayPostGroups).map(day => {
                    // assign like count variables for each day
                    const dayPosts = dayPostGroups[day];
                    const dayLikeCount = this.sumPostsLikes(dayPosts);
                    const dayDisplay = moment.unix(day).format('MMMM D, YYYY');
                    const selectDay = this.selectDay.bind(this, day);

                    // show the day like count vertex
                    return (
                        <circle {...tooltipProps(`Click to see your ${dayLikeCount} likes on ${dayDisplay}`, 'top')}
                            className="vertex"
                            key={day}
                            onClick={selectDay}
                            cx={scaleWidth(day)}
                            cy={scaleHeight(dayLikeCount)}
                            r="5">
                        </circle>
                    );
                  })}
                </svg>
              </div>

              {/* selected day modal */}
              {this.renderDayModal(dayPostGroups)}
            </div>
          </div>

          {/* click prompt */}
          <h6 className="center">
            Click on points to see the posts that people liked...
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
export const WhenContainer = connect(
    mapStateToProps,
    actions
)(When);
