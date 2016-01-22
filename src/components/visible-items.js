// libraries
import React, { PropTypes } from 'react';

// components
import { VirtualScroll } from 'react-virtualized';

// mixins
import PureRenderMixin from 'react-addons-pure-render-mixin';

// constants
const HEIGHT_COLLECTION_ITEM = 71;
const LIMIT_ITEMS_DISPLAYED = 10;

/**
 * VisibleItems only renders items that are visible in the DOM.
 */
export default React.createClass({

  displayName: 'VisibleItems',

  propTypes: {
    items: PropTypes.array.isRequired,
    limitItemsDisplayed: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    rowRenderer: PropTypes.func.isRequired
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      items: [],
      limitItemsDisplayed: LIMIT_ITEMS_DISPLAYED,
      rowHeight: HEIGHT_COLLECTION_ITEM,
      rowRenderer: index => {
        const { items } = this.props;
        return items[index];
      }
    };
  },

  render() {
    // assign variables from the props
    const { items, rowHeight, limitItemsDisplayed } = this.props;
    const rowsCount = items.length;
    const height = Math.min(items.length * rowHeight, limitItemsDisplayed * rowHeight);

    // show the collection
    return (
        <VirtualScroll {...this.props}
            height={height}
            rowsCount={rowsCount}
            rowHeight={rowHeight}
            rowRenderer={index => {
              return items[index];
            }}/>
    );
  }
});
