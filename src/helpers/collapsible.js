const createCollapsibles = element => {
  // initialize all jquery collapsibles
  const $element = window.$(element);
  if ($element && $element.length) {
    const $collapsibles = $element.find('.collapsible');
    if ($collapsibles && $collapsibles.length) {
      $collapsibles.collapsible();
      return $collapsibles;
    }
  }
};

// export collapsible helper functions
module.exports = {
  createCollapsibles
};
