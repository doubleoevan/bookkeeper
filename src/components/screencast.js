// libraries
import React from 'react';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';
import TooltipMixin from '../mixins/tooltips';

// functions
import { tooltipProps } from '../helpers/tooltip';

// assets
import screencastSrc from '../../assets/screencast.mp4';

// constants
import { SCREENCAST_IMAGE_URL } from '../app/config';

/**
 * Screencast shows the demo video for the app.
 */
export default React.createClass({

  displayName: 'Screencast',

  mixins: [PureRenderMixin, TooltipMixin],

  render() {
    // show the screencast
    return (
        <div {...tooltipProps('Click the play button to watch a demo')}
            className="screencast card-panel z-depth-2">
          <video src={screencastSrc}
                 poster={SCREENCAST_IMAGE_URL}
                 preload="metadata"
                 controls>
            Your browser does not support the <code>video</code> element.
          </video>
        </div>
    );
  }
});
