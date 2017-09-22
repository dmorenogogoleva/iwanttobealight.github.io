'use strict';

window.form = (function () {


  var MAX_NUMBER_OF_HASHTAGS = 6;
  var MAX_LENGTH_OF_COMMENT = 140;
  var NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS = 100;
  var NUMBER_FOR_GET_THIRD_PART_OF_NUMBER = 33;
  var MAX_WIDTH_OF_LEVEL_PIN = 450;
  var MIN_WIDTH_OF_LEVEL_PIN = 0;
  var VALUE_OF_LEVEL_PIN_IN_PERSENT = MAX_WIDTH_OF_LEVEL_PIN / NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS;

  var uploadForm = document.querySelector('.upload-form');
  var uploadEffectField = document.querySelector('.upload-effect');
  var imagePreview = uploadForm.querySelector('.effect-image-preview');
  var effectsContainer = uploadEffectField.querySelector('.upload-effect-controls');
  var sizeControlsValue = uploadForm.querySelector('.upload-resize-controls-value');
  var effectLevelValue = effectsContainer.querySelector('.upload-effect-level-val');
  var effectLevelPin = effectsContainer.querySelector('.upload-effect-level-pin');
  var uploadFormInputHashtags = uploadForm.querySelector('.upload-form-input-hashtags');
  var uploadFormHashtags = uploadForm.querySelector('.upload-form-hashtags');
  var uploadFormInputDescription = uploadForm.querySelector('.upload-form-input-description');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');
  var uploadFormHashtagsHint = uploadForm.querySelector('.upload-form-hashtags-hint');
  var uploadFormDescriptionHint = uploadForm.querySelector('.upload-form-description-hint');
  var uploadFormSubmitBtn = uploadForm.querySelector('.upload-form-submit');
  var effectLevel = effectsContainer.querySelector('.upload-effect-level');
  var inputFile = uploadForm.querySelector('.upload-form-input-file');

  // изменение размера фотки
  var resizeImage = function (scaleElement, valueSize) {
    scaleElement.style.transform = 'scale(' + valueSize + ')';
    sizeControlsValue.setAttribute('value', valueSize * NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS + '%');
  };

  // добавление фильтра на фотку
  var addFilter = function (elementImage, valueInput) {
    elementImage.removeAttribute('class');
    elementImage.classList.add('effect-' + valueInput);

    var filterClass = elementImage.classList.value;

    switch (filterClass) {
      case 'effect-chrome' : elementImage.style.filter = 'grayscale(1)';
        break;
      case 'effect-sepia' : elementImage.style.filter = 'sepia(1)';
        break;
      case 'effect-marvin' : elementImage.style.filter = 'invert(100%)';
        break;
      case 'effect-phobos' : elementImage.style.filter = 'blur(5px)';
        break;
      case 'effect-heat' : elementImage.style.filter = 'brightness(5)';
        break;
      default: elementImage.style.filter = 'none';
        effectLevel.classList.add('hidden');
        break;
    }
  };

  // сброс значения фильтра на значение по умолчанию
  var resetFilter = function () {
    effectLevelPin.style.left = '100%';
    effectLevelValue.style.width = '98%';
  };

  var effectsContainerClickHandler = function (evt) {
    window.initializeFilters.setFilter(evt, imagePreview, addFilter, resetFilter);
  };

  // ползунок
  var effectLevelPinMousedownHandler = function (evt) {
    evt.preventDefault();

    var filterClass = imagePreview.classList.value;

    var startCoords = {
      x: evt.clientX
    };

    var effectLevelPinMouseMoveHandler = function (moveEvent) {
      moveEvent.preventDefault();

      // перемещение ползунка
      var shift = {
        x: startCoords.x - moveEvent.clientX
      };

      startCoords = {
        x: moveEvent.clientX
      };

      var clientLevelPin = Number(effectLevelPin.offsetLeft - shift.x);
      var clientLevelValue = Number(effectLevelPin.offsetLeft / VALUE_OF_LEVEL_PIN_IN_PERSENT);

      if (clientLevelPin >= MAX_WIDTH_OF_LEVEL_PIN) {
        return false;
      }

      if (clientLevelPin <= MIN_WIDTH_OF_LEVEL_PIN) {
        return false;
      }

      effectLevelPin.style.left = clientLevelPin + 'px';
      effectLevelValue.style.width = clientLevelValue + '%';

      // стандартное наложение фильтров
      switch (filterClass) {
        case 'effect-chrome' : imagePreview.style.filter = 'grayscale(' + (clientLevelValue / NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS) + ')';
          break;
        case 'effect-sepia' : imagePreview.style.filter = 'sepia(' + (clientLevelValue / NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS) + ')';
          break;
        case 'effect-marvin' : imagePreview.style.filter = 'invert(' + (clientLevelValue) + '%)';
          break;
        case 'effect-phobos' : imagePreview.style.filter = 'blur(' + clientLevelValue / NUMBER_FOR_GET_THIRD_PART_OF_NUMBER + 'px)';
          break;
        case 'effect-heat' : imagePreview.style.filter = 'brightness(' + clientLevelValue / NUMBER_FOR_GET_THIRD_PART_OF_NUMBER + ')';
          break;
        default:
          imagePreview.style.filter = 'none';
          break;
      }
      return true;
    };

    var effectLevelPinMouseUpHandler = function (upEvent) {
      upEvent.preventDefault();

      document.removeEventListener('mousemove', effectLevelPinMouseMoveHandler);
      document.removeEventListener('mouseup', effectLevelPinMouseUpHandler);
    };

    document.addEventListener('mousemove', effectLevelPinMouseMoveHandler);
    document.addEventListener('mouseup', effectLevelPinMouseUpHandler);
  };

  // валидация хэштегов
  // проверяет количество хэштегов
  var testNumberOfHastags = function (arrHashtags) {
    return arrHashtags.length < MAX_NUMBER_OF_HASHTAGS;
  };

  // проверяет соответствие хэштега паттерну
  var testHastagsForPattern = function (arrHashtags) {
    var hastagPattern = /^#[а-яa-z0-9]{1,20}$/i;

    for (var i = 0; i < arrHashtags.length; i++) {
      var check = true;

      if (hastagPattern.test(arrHashtags[i]) === false) {
        check = false;
        return false;
      }
    }
    return check;
  };

  // проверяет есть ли одинаковые хэштеги
  var testHastagsForUniq = function (arrHashtags) {

    var countMatches = function () {
      for (var i = 0; i < arrHashtags.length; i++) {
        if (lastHashtag === arrHashtags[i]) {
          count++;
        }
        if (count > 1) {
          break;
        }
      }
      return count;
    };

    for (var e = 0; e < arrHashtags.length; e++) {
      var lastHashtag = arrHashtags[e];
      var count = 0;
      countMatches();
      if (count >= 2) {
        return false;
      }
    }
    return true;
  };

  // убирает красную рамку если поле не заполнено
  var removeRedFrame = function (formInput, formHint) {
    var valueLength = formInput.value.trim().length;
    if (valueLength === 0) {
      formInput.setAttribute('value', '');
      formInput.classList.remove('upload-message-error');
      formHint.innerHTML = '';
    }
  };


  // проверка хэштегов
  var testFormHashtags = function () {

    var formHashtags = uploadFormHashtags.value.trim().split(' ');

    if (uploadFormInputHashtags.value.length === 0) {
      return true;
    }

    if (testNumberOfHastags(formHashtags)) {
      uploadFormHashtagsHint.innerHTML = '';
    } else {
      uploadFormInputHashtags.classList.add('upload-message-error');
      uploadFormHashtagsHint.innerHTML = 'не больше пяти хэштегов';
      return false;
    }

    if (testHastagsForPattern(formHashtags)) {
      uploadFormHashtagsHint.innerHTML = '';
    } else {
      uploadFormInputHashtags.classList.add('upload-message-error');
      uploadFormHashtagsHint.innerHTML = 'хэштег должен содержать не более 20 знаков и начинаться со знака \'#\'';
      return false;
    }

    if (formHashtags.length > 1) {
      if (testHastagsForUniq(formHashtags)) {
        uploadFormHashtagsHint.innerHTML = '';
      } else {
        uploadFormInputHashtags.classList.add('upload-message-error');
        uploadFormHashtagsHint.innerHTML = 'хэштеги не должны совпадать';
        return false;
      }
    }

    uploadFormInputHashtags.classList.remove('upload-message-error');
    return true;
  };

  function formHashtagsBlurHandler() {
    testFormHashtags();
    removeRedFrame(uploadFormInputHashtags, uploadFormHashtagsHint);
  }

  var uploadEffectFieldClickHandler = function () {
    removeRedFrame(uploadFormInputHashtags, uploadFormHashtagsHint);
  };

  // валидация поля для комментария
  function testDescriptionField() {
    var descriptionFieldLength = uploadFormInputDescription.textLength;
    if (descriptionFieldLength > MAX_LENGTH_OF_COMMENT) {
      uploadFormInputDescription.classList.add('upload-message-error');
      uploadFormDescriptionHint.innerHTML = 'комментарий должен быть короче 140 символов';
      return false;
    } else {
      uploadFormInputDescription.classList.remove('upload-message-error');
      uploadFormDescriptionHint.innerHTML = '';
    }
    return true;
  }

  var descriptionFieldBlurHandler = function () {
    testDescriptionField();
    removeRedFrame(uploadFormInputDescription, uploadFormDescriptionHint);
  };

  // проверка полей перед отправкой формы
  var uploadFormClickHandler = function (evt) {
    if (!testFormHashtags() || !testDescriptionField()) {
      evt.preventDefault();
    }
  };

  // отправка формы на сервер
  var uploadFormSubmitHandler = function (evt) {
    evt.preventDefault();
    window.backend.backendSave(new FormData(uploadForm), closeUploadOverlay, window.util.onError, window.util.serverEventsHandler);
  };


  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    window.util.errorHintClickHandler();
  };

  var resetForm = function (closeForm) {
    uploadFormHashtags.value = '';
    uploadFormInputDescription.value = '';
    inputFile.value = '';
    closeForm();
  };

  effectsContainer.addEventListener('click', effectsContainerClickHandler);
  effectLevelPin.addEventListener('mousedown', effectLevelPinMousedownHandler);
  uploadFormInputHashtags.addEventListener('blur', formHashtagsBlurHandler);
  uploadFormInputDescription.addEventListener('blur', descriptionFieldBlurHandler);
  uploadForm.addEventListener('submit', uploadFormSubmitHandler);
  uploadEffectField.addEventListener('click', uploadEffectFieldClickHandler);
  uploadFormSubmitBtn.addEventListener('click', uploadFormClickHandler);

  return {
    resizeImage: resizeImage,
    addFilter: addFilter,
    resetForm: resetForm,
    NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS: NUMBER_FOR_ROUNDING_NUMBER_TO_HUNDREDTHS
  };
})();
