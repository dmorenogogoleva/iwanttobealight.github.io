'use strict';

// модуль изменения шкалы
window.initializeScale = (function () {

  var MIN_VALUE_OF_SCALE = 25;
  var MAX_VALUE_OF_SCALE = 100;

  var uploadForm = document.querySelector('.upload-form');
  var imagePreview = uploadForm.querySelector('.effect-image-preview');
  var sizeControlsValue = uploadForm.querySelector('.upload-resize-controls-value');
  var resizeButtons = uploadForm.querySelectorAll('.upload-resize-controls-button');
  var minSizeBtn = uploadForm.querySelector('.upload-resize-controls-button-dec');
  var plusSizeBtn = uploadForm.querySelector('.upload-resize-controls-button-inc');

  var changeScale = function (evt, scaleElement, adjustScale) {

    var sizeValue = (parseInt(sizeControlsValue.getAttribute('value'), 10)) / window.form.NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS;
    var sizeStepValue = Number(sizeControlsValue.step);

    var targetButtton = evt.target;
    if (targetButtton === minSizeBtn) {
      sizeValue -= sizeStepValue / window.form.NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS;
      if (sizeValue <= MIN_VALUE_OF_SCALE / window.form.NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS) {
        sizeValue = MIN_VALUE_OF_SCALE / window.form.NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS;
      }
    } else if (targetButtton === plusSizeBtn) {
      sizeValue += sizeStepValue / window.form.NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS;
      if (sizeValue >= MAX_VALUE_OF_SCALE / window.form.NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS) {
        sizeValue = MAX_VALUE_OF_SCALE / window.form.NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS;
      }
    }

    var valueSize = sizeValue;

    if (typeof adjustScale === 'function') {
      adjustScale(scaleElement, valueSize);
    }
  };

  var resizeButtonsClickHandler = function (evt) {
    window.initializeScale.changeScale(evt, imagePreview, window.form.resizeImage);
  };

  resizeButtons.forEach(function (button) {
    button.addEventListener('click', resizeButtonsClickHandler);
  });

  return {
    changeScale: changeScale
  };
})();
