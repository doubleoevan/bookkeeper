const createSlider = (element, autoClose = true) => {
  // initialize all jquery sliders
  const $element = window.$(element);
  if ($element && $element.length) {
    $element.sideNav({
      closeOnClick: autoClose
    });
    return $element;
  }
};

// export slider helper functions
module.exports = {
  createSlider
};
