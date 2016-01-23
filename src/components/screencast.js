// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// functions
import { tooltipProps } from '../helpers/tooltip';

// constants
import { SCREENCAST_URL } from '../app/config';

/**
 * Screencast shows the demo video for the app.
 */
export default React.createClass({

  displayName: 'Screencast',

  mixins: [PureRenderMixin, TooltipMixin],

  render() {
    // show the screencast
    return (
        <div {...tooltipProps('Watch a demo of Bookkeeper in action')}
            className="screencast card-panel z-depth-2">
          <video src={SCREENCAST_URL} preload="metadata" controls>
            Your browser does not support the <code>video</code> element.
          </video>
        </div>
    );
  }
});
