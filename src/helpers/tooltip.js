// libraries
import _ from 'lodash';

// constants
import { LIMIT_UPDATES_FETCHED, LIMIT_PHOTOS_FETCHED, LIMIT_VIDEOS_FETCHED } from '../app/config';
const TOOLTIP_DATA = `This data is collected from
                      your ${LIMIT_UPDATES_FETCHED} most recent updates,
                      your ${LIMIT_PHOTOS_FETCHED} most recent photos,
                      and your ${LIMIT_VIDEOS_FETCHED} most recent videos`.replace(/\s+/g, ' ');

const tooltipProps = (tooltip = '', place = 'right', classes = 'custom-tooltip', border = true) => {
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
    'data-class': classes,
    'data-place': place,
    'data-tip': tooltipProp,
    'data-border': border
  };
};

// export tooltip helper functions
module.exports = {
  tooltipProps,
  dataTooltipProps: tooltipProps.bind(this, TOOLTIP_DATA)
};
