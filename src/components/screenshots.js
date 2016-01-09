// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// components
import { Link } from 'react-router';

// functions
import { tooltipProps } from '../helpers/tooltip';

// assets
import whoSrc from '../../assets/who.png';
import whatSrc from '../../assets/what.png';
import whenSrc from '../../assets/when.png';
import whereSrc from '../../assets/where.png';

/**
 * Screenshots shows screen shots from the app.
 */
export const Screenshots = React.createClass({

  displayName: 'Screenshots',

  mixins: [PureRenderMixin, TooltipMixin],

  renderScreenshot(options) {
    // show the screenshot image link
    const { path, tooltip, src } = options;
    return (
        <Link {...tooltipProps(tooltip, 'top')} className="screenshot" to={path}>
          <img alt={tooltip}
               className="card-panel z-depth-2"
               src={src}/>
        </Link>
    );
  },

  render() {
    // show the screenshot image links
    return (
        <div className="screenshots row">
          <div className="col s6">
            {/* who screenshot */}
            {this.renderScreenshot({
              path: '/who',
              src: whoSrc,
              tooltip: 'See who liked your posts.',
              title: 'Who?'
            })}

            {/* when screenshot */}
            {this.renderScreenshot({
              path: '/when',
              src: whenSrc,
              tooltip: 'See when your posts were liked.',
              title: 'When?'
            })}
          </div>
          <div className="col s6">
            {/* what screenshot */}
            {this.renderScreenshot({
              path: '/what',
              src: whatSrc,
              tooltip: 'See your most liked posts.',
              title: 'What?'
            })}

            {/* where screenshot */}
            {this.renderScreenshot({
              path: '/where',
              src: whereSrc,
              tooltip: 'See where your posts were liked.',
              title: 'Where?'
            })}
          </div>
        </div>
    );
  }
});
