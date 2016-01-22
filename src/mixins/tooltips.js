// components
import ReactTooltip from 'react-tooltip';

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
    // remove all tooltips
    ReactTooltip.hide();

    // initialize the tooltips
    ReactTooltip.rebuild();
  },

  hideTooltips() {
    // remove all tooltips
    ReactTooltip.hide();
  }
};
