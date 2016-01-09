// libraries
import numeral from 'numeral';

const pluralize = (number = 0, singular = 'item', plural = 'items') => {
  // return the singular or plural form of a term based on the number
  if (number === 1) {
    return singular;
  }
  return plural;
};

const formatNumber = (number = 0, format = '0,0') => {
  // add commas and remove decimals from the number display
  return numeral(number).format(format);
};

// export number helper functions
export default {
  pluralize,
  formatNumber
};
