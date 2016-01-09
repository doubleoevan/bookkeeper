const createModals = element => {
  // initialize all jquery modals
  const $element = window.$(element);
  if ($element && $element.length) {
    const $modals = $element.find('.modal-trigger');
    if ($modals && $modals.length) {
      $modals.off('click', window.$.leanModal); // prevent multiple modals from opening
      $modals.leanModal();
      return $modals;
    }
  }
};

const openModal = selector => {
  // open a specific jquery modal
  const $element = window.$(selector);
  if ($element && $element.length) {
    $element.openModal();
    return $element;
  }
};

// export modal helper functions
module.exports = {
  createModals,
  openModal
};
