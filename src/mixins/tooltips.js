// libraries
import ReactDOM from 'react-dom';

// functions
import { createTooltips, removeTooltips } from '../helpers/tooltip';

/**
 * TooltipMixin applies tooltip helper methods to component lifecycle callbacks.
 */
export default {

  // update the tooltips
  componentDidMount() {
    this.showTooltips();
  },

  // update the tooltips
  componentDidUpdate() {
    this.showTooltips();
  },

  // destroy all tooltips
  componentWillUnmount() {
    this.hideTooltips();
  },

  showTooltips() {
    // initialize the tooltips
    const rootNode = ReactDOM.findDOMNode(this);
    createTooltips(rootNode);
  },

  hideTooltips() {
    // remove all tooltips
    const rootNode = ReactDOM.findDOMNode(this);
    removeTooltips(rootNode);
  }
};
