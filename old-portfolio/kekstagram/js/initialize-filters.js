'use strict';

// модуль наложения фильтра
window.initializeFilters = (function () {
  var effectLevel = document.querySelector('.upload-effect-level');

  var setFilter = function (evt, filterElement, applyFilter, resetFilter) {

    if (evt.target.tagName === 'LABEL') {
      effectLevel.classList.remove('hidden');
      var filterLabel = evt.target;
      var inputValue = document.querySelector('#' + filterLabel.getAttribute('for')).getAttribute('value');
    } else {
      return;
    }

    if (typeof applyFilter === 'function') {
      applyFilter(filterElement, inputValue);
      resetFilter();
    }
    return;
  };

  return {
    setFilter: setFilter
  };
})();

