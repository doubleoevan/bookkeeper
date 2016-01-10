// libraries
import ReactDOM from 'react-dom';

// functions
import { createCollapsibles } from '../helpers/collapsible';

/**
 * CollapsibleMixin applies collapsible helper methods to component lifecycle callbacks.
 */
export default {

  // update the collapsibles
  componentDidMount() {
    this.showCollapsibles();
  },

  // update the collapsibles
  componentDidUpdate() {
    this.showCollapsibles();
  },

  showCollapsibles() {
    // initialize the collapsibles
    const rootNode = ReactDOM.findDOMNode(this);
    createCollapsibles(rootNode);
  }
};
