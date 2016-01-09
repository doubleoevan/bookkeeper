// libraries
import ReactDOM from 'react-dom';

// functions
import { createTooltips, removeTooltips } from '../helpers/tooltip';

/**
 * TooltipMixin shows and hides tooltips
 */
export default {

  // show the tooltips
  componentDidMount() {
    this.showTooltips();
  },

  // show the tooltips
  componentDidUpdate() {
    this.showTooltips();
  },

  // hide all tooltips
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
