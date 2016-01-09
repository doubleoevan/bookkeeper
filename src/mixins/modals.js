// libraries
import ReactDOM from 'react-dom';

// functions
import { createModals } from '../helpers/modal';

/**
 * ModalMixin shows modals
 */
export default {

  // show the modals
  componentDidMount() {
    this.showModals();
  },

  // show the modals
  componentDidUpdate() {
    this.showModals();
  },

  showModals() {
    // initialize the modals
    const rootNode = ReactDOM.findDOMNode(this);
    createModals(rootNode);
  }
};
