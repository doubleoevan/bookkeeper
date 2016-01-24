// libraries
import React from 'react';
import ReactDOM from 'react-dom';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

/**
 * Advertisement shows a google advertisement.
 */
export default React.createClass({

  displayName: 'Advertisement',

  mixins: [PureRenderMixin],

  componentDidMount() {
    // initialize the ad if it is visible
    const ad = ReactDOM.findDOMNode(this.refs.ad);
    if (ad.offsetWidth) {
      const ads = window.adsbygoogle || [];
      ads.push({});
    }
  },

  render() {
    // show the advertisement
    return (
        <ins {...this.props}
            ref="ad"
            className="adsbygoogle ad"
            data-ad-client="ca-pub-9478244446536262"
            data-ad-slot="9327203034"
            data-ad-format="auto"/>
    );
  }
});
