// libraries
import _ from 'lodash';

// constants
import { LIMIT_UPDATES_FETCHED, LIMIT_PHOTOS_FETCHED, LIMIT_VIDEOS_FETCHED } from '../app/config';
const TOOLTIP_DATA = `This data is collected from
                      your ${LIMIT_UPDATES_FETCHED} most recent updates,
                      your ${LIMIT_PHOTOS_FETCHED} most recent photos,
                      and your ${LIMIT_VIDEOS_FETCHED} most recent videos`.replace(/\s+/g, ' ');

const removeTooltips = element => {
  // hide all jquery tooltips
  const $element = window.$(element);
  if ($element && $element.length) {
    const $tooltips = $element.find('[data-tooltip]');
    if ($tooltips && $tooltips.length) {
      $tooltips.tooltip('remove');
      return $tooltips;
    }
  }
};

const createTooltips = element => {
  // initialize all jquery tooltips
  const $tooltips = removeTooltips(element);
  if ($tooltips && $tooltips.length) {
    $tooltips.tooltip();
    return $tooltips;
  }
};

const tooltipProps = (tooltip = '', position = 'right', delay = '50', classes = 'custom-tooltip') => {
  // ignore an empty tooltip
  if (!tooltip.length) {
    return {};
  }

  // convert the tooltip from an array to a comma delimited string if necessary
  let tooltipProp = tooltip;
  if (_.isArray(tooltip)) {
    tooltipProp = tooltip.join(', ');
  }

  // return the tooltip props
  return {
    'custom-css': classes,
    'data-delay': delay,
    'data-position': position,
    'data-tooltip': tooltipProp
  };
};

// export tooltip helper functions
module.exports = {
  createTooltips,
  removeTooltips,
  tooltipProps,
  dataTooltipProps: tooltipProps.bind(this, TOOLTIP_DATA)
};
