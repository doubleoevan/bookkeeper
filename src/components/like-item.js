// libraries
import React, { PropTypes } from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// functions
import { tooltipProps } from '../helpers/tooltip';

/**
 * LikeItem shows a like collection item for a post.
 */
export default React.createClass({

  displayName: 'LikeItem',

  propTypes: {
    like: PropTypes.shape({
      name: PropTypes.string,
      link: PropTypes.string,
      picture: PropTypes.string
    })
  },

  mixins: [PureRenderMixin, TooltipMixin],

  render() {
    // assign variables from the props
    const { name, link, picture } = this.props.like;

    // show the like item
    return (
        <a {...tooltipProps(`Click to open ${name}'s Facebook page`, 'top')}
            className="collection-item"
            href={link}
            target="_blank">
          <div className="row">
            <div className="col s11">
              <img className="item-icon responsive-img circle left" src={picture}/>
              <h5 className="truncate">{name}</h5>
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
