// libraries
import ReactDOM from 'react-dom';

// functions
import { createCollapsibles } from '../helpers/collapsible';

/**
 * CollapsibleMixin shows collapsibles
 */
export default {

  // show the collapsibles
  componentDidMount() {
    this.showCollapsibles();
  },

  // show the collapsibles
  componentDidUpdate() {
    this.showCollapsibles();
  },

  showCollapsibles() {
    // initialize the collapsibles
    const rootNode = ReactDOM.findDOMNode(this);
    createCollapsibles(rootNode);
  }
};
