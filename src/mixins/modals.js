// libraries
import ReactDOM from 'react-dom';

// functions
import { createModals } from '../helpers/modal';

/**
 * ModalMixin applies modals helper methods to component lifecycle callbacks.
 */
export default {

  // update the modals
  componentDidMount() {
    this.showModals();
  },

  // update the modals
  componentDidUpdate() {
    this.showModals();
  },

  showModals() {
    // initialize the modals
    const rootNode = ReactDOM.findDOMNode(this);
    createModals(rootNode);
  }
};
