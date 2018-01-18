'use strict';


window.util = (function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var errorHint = document.querySelector('.upload-form-error-hint');

  var isEscKeycode = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };

  var isEnterKeycode = function (evt) {
    return evt.keyCode === ENTER_KEYCODE;
  };

  var findRandomRangeNum = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  var errorHintClickHandler = function () {
    errorHint.classList.add('hidden');
  };

  var onError = function (error) {
    errorHint.classList.remove('hidden');
    errorHint.innerHTML = error;
    throw new Error(error);
  };

  var serverEventsHandler = function (xhr, onSuccess, onErr) {
    var error;
    switch (xhr.status) {
      case 200:
        onSuccess();
        break;
      case 400:
        error = 'Неверный запрос';
        break;
      case 401:
        error = 'Пользователь не авторизован';
        break;
      case 404:
        error = 'Ничего не найдено';
        break;
      case 0:
        error = 'Сервер не отвечает';
        break;
      default:
        error = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
    }

    if (error) {
      onErr(error);
    }

    return true;
  };

  errorHint.addEventListener('click', errorHintClickHandler);
  return {
    isEscKeycode: isEscKeycode,
    isEnterKeycode: isEnterKeycode,
    findRandomRangeNum: findRandomRangeNum,
    onError: onError,
    errorHintClickHandler: errorHintClickHandler,
    serverEventsHandler: serverEventsHandler
  };
})();

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
  

window.picture = (function () {
  
    var picturesBlock = document.querySelector('.pictures');
    var filtersBLock = document.querySelector('.filters');
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#picture-template');
  
    // загружает фотки с сервера
    var loadPicturesFromServer = function (dataPictures) {
  
      var newPicture = template.content.cloneNode(true);
      newPicture.querySelector('.picture-img').src = dataPictures.url;
      newPicture.querySelector('.picture-likes').textContent = dataPictures.likes;
      newPicture.querySelector('.picture-comments').textContent = dataPictures.comments.length;
      newPicture.querySelector('.picture-img').setAttribute('data-id', +(dataPictures.url.slice(7, 9)));
  
      return newPicture;
    };
  
    // размещает фотки на странице
    var fillPicturesContainerFromServer = function (dataPictures) {
      for (var i = 0; i < dataPictures.length; i++) {
        fragment.appendChild(window.picture.loadPicturesFromServer(dataPictures[i]));
      }
  
      picturesBlock.appendChild(fragment);
  
      // закрывает соообщение об ошибке
      window.util.errorHintClickHandler();
  
      // показывает блок с фильтрами
      filtersBLock.classList.remove('hidden');
      window.dataPictures = dataPictures;
      window.preview.openPopup(dataPictures);
    };
  
    // фильтрует фотки на странице
    var filterPictures = function (dataArray) {
      filtersBLock.addEventListener('click', function (evt) {
        if (evt.target.tagName === 'LABEL') {
          var filterLabel = evt.target;
          var inputValue = document.querySelector('#' + filterLabel.getAttribute('for')).getAttribute('value');
        } else {
          return;
        }
  
        var orderOfElements = dataArray.slice();
  
        switch (inputValue) {
          case 'popular':
            orderOfElements = dataArray.sort(function (first, second) {
              if (first.likes > second.likes) {
                return -1;
              } else if (first.likes < second.likes) {
                return 1;
              } else {
                return 0;
              }
            });
            break;
          case 'discussed':
            orderOfElements = dataArray.sort(function (first, second) {
              if (first.comments.length > second.comments.length) {
                return -1;
              } else if (first.comments.length < second.comments.length) {
                return 1;
              } else {
                return 0;
              }
            });
            break;
          case 'random':
            orderOfElements = dataArray.sort(function () {
  
              if (window.util.findRandomRangeNum(1, 7) > window.util.findRandomRangeNum(8, 15)) {
                return -1;
              } else if (window.util.findRandomRangeNum(16, 22) < window.util.findRandomRangeNum(23, 27)) {
                return 1;
              } else {
                return 0;
              }
            });
            break;
          default:
            orderOfElements = window.dataPictures.slice();
        }
  
        deletePicturesFromContainer();
        fillPicturesContainerFromFilter(orderOfElements);
        return;
      });
    };
  
    // размещает фотки на странице после фильтрации
    var fillPicturesContainerFromFilter = function (dataPictures) {
  
      for (var i = 0; i < dataPictures.length; i++) {
        fragment.appendChild(window.picture.loadPicturesFromServer(dataPictures[i]));
      }
      picturesBlock.appendChild(fragment);
      window.preview.openPopup();
    };
  
    // удаляет фотки из блока
    var deletePicturesFromContainer = function () {
      var photos = document.querySelectorAll('.picture');
  
      photos.forEach(function (photo) {
        photo.remove();
      });
    };
  
    return {
      // загружает фотки с сервера
      loadPicturesFromServer: loadPicturesFromServer,
      // размещает фотки на странице
      fillPicturesContainerFromServer: fillPicturesContainerFromServer,
      // фильтрует фотки на странице
      filterPictures: filterPictures
    };
  })();

window.preview = (function () {
  
    var POPUP_IMAGE_WIDTH = 600;
  
    // открытие-закрытие окна просмотра фотки
    var galleryOverlay = document.querySelector('.gallery-overlay');
    var uploadForm = document.querySelector('.upload-form');
    var imagePreview = uploadForm.querySelector('.effect-image-preview');
    var pictureBtnClose = galleryOverlay.querySelector('.gallery-overlay-close');
    var uploadOverlay = uploadForm.querySelector('.upload-overlay');
    var uploadInput = uploadForm.querySelector('.upload-input');
    var uploadControl = uploadForm.querySelector('.upload-control');
    var sizeControlsValue = document.querySelector('.upload-resize-controls-value');
    var effectLevel = document.querySelector('.upload-effect-level');
    var uploadFormBtnCancel = uploadForm.querySelector('.upload-form-cancel');
    var uploadFormInputs = uploadForm.querySelectorAll('.upload-form-input');
    var uploadFormInputFile = uploadForm.querySelector('.upload-form-input-file');
    var filterNone = uploadForm.querySelector('.upload-effect-label-none');
    var uploadFormInputDescription = uploadForm.querySelector('.upload-form-input-description');
    var likesContainer = galleryOverlay.querySelector('.likes-count');
    var commentsContainer = galleryOverlay.querySelector('.comments-count');
    var urlImg = galleryOverlay.querySelector('.gallery-overlay-image');
    var widthImg = galleryOverlay.querySelector('.gallery-overlay-image');
  
    // добавляет контент в карточку
    function addContentToPopup(itemId) {
  
      likesContainer.textContent = window.dataPictures[itemId - 1].likes;
      commentsContainer.textContent = window.dataPictures[itemId - 1].comments.length;
      urlImg.src = window.dataPictures[itemId - 1].url;
      widthImg.width = POPUP_IMAGE_WIDTH;
    }
  
    var openPopup = function () {
      var picturesImg = document.querySelectorAll('.picture-img');
  
      picturesImg.forEach(function (pic) {
        pic.addEventListener('click', function (evt) {
          evt.preventDefault();
          addContentToPopup(pic.getAttribute('data-id'));
          galleryOverlay.classList.remove('hidden');
          document.addEventListener('keydown', escPressKeydownHandler);
        });
      });
    };
  
    var escPressKeydownHandler = function (evt) {
      if (window.util.isEscKeycode(evt)) {
        galleryOverlay.classList.add('hidden');
        document.removeEventListener('keydown', escPressKeydownHandler);
        closeUploadForm();
      }
    };
  
    var pictureCloseHandler = function () {
      galleryOverlay.classList.add('hidden');
    };
  
    var pictureCloseKeydownHandler = function (evt) {
      if (window.util.isEnterKeycode(evt)) {
        pictureCloseHandler();
      }
    };
  
    var uploadFormOpenHandler = function () {
      uploadOverlay.classList.remove('hidden');
      document.addEventListener('keydown', escPressKeydownHandler);
    };
  
    var closeUploadForm = function () {
      if (checkInputInFocus(uploadFormInputDescription)) {
        document.addEventListener('keydown', escPressKeydownHandler);
      } else {
        // сброс размера фотки
        imagePreview.style.transform = 'scale(' + 1 + ')';
        sizeControlsValue.setAttribute('value', '100%');
  
        // сброс фильтров для фотки
        imagePreview.style.filter = 'none';
        filterNone.click();
        effectLevel.classList.add('hidden');
  
        uploadOverlay.classList.add('hidden');
        uploadFormInputFile.value = '';
  
        uploadFormInputs.forEach(function (input) {
          input.value = '';
        });
  
        document.removeEventListener('keydown', escPressKeydownHandler);
      }
    };
  
    var checkInputInFocus = function (input) {
      return input === document.activeElement;
    };
  
    var uploadControlKeydownHandler = function (evt) {
      if (window.util.isEnterKeycode(evt)) {
        uploadFormOpenHandler();
      }
    };
  
    var uploadFormBtnCancelClickHandler = function () {
      closeUploadForm();
    };
  
    pictureBtnClose.addEventListener('click', pictureCloseHandler);
    pictureBtnClose.addEventListener('keydown', pictureCloseKeydownHandler);
  
    uploadInput.addEventListener('change', uploadFormOpenHandler);
    uploadControl.addEventListener('keydown', uploadControlKeydownHandler);
    uploadFormBtnCancel.addEventListener('click', uploadFormBtnCancelClickHandler);
  
    return {
      uploadFormOpenHandler: uploadFormOpenHandler,
      openPopup: openPopup,
      closeUploadForm: closeUploadForm
    };
  })();


window.loadPic = (function () {
  
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
    var IMAGE_PREVIEW_WIDTH = 586;
    var uploadImage = document.querySelector('.upload-image');
    var imagePreview = document.querySelector('.effect-image-preview');
    var inputFile = document.querySelector('.upload-form-input-file');
    var uploadControl = document.querySelector('.upload-control');
  
    var addPhotoToInput = function (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });
  
      if (matches) {
        var reader = new FileReader();
  
        reader.addEventListener('load', function () {
          imagePreview.src = reader.result;
          imagePreview.width = IMAGE_PREVIEW_WIDTH;
        });
      }
      reader.readAsDataURL(file);
    };
  
    // загрузка фоток через инпут
    var inputFileChangeHandler = function () {
      var file = inputFile.files[0];
  
      addPhotoToInput(file);
    };
  
    // загрузка фоток перетаскиванием
    var uploadImageDragoverHandler = function (evt) {
      evt.preventDefault();
      uploadControl.classList.add('dropped');
      uploadControl.innerHTML = 'перетащите фотографию в это окно';
    };
  
    var documentDropHandler = function (evt) {
      evt.preventDefault();
      uploadControl.classList.remove('dropped');
      uploadControl.innerHTML = '';
      window.preview.uploadFormOpenHandler();
  
      var file = evt.dataTransfer.files[0];
  
      addPhotoToInput(file);
    };
  
    inputFile.addEventListener('change', inputFileChangeHandler);
    uploadImage.addEventListener('dragover', uploadImageDragoverHandler);
    document.addEventListener('drop', documentDropHandler);
  })();
  

window.backend = (function () {

  var backendLoad = function (onLoad, onFilter, onErr, addMessages) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    var onSuccess = function () {
      onLoad(xhr.response);
      onFilter(xhr.response);
    };

    xhr.addEventListener('load', function () {
      addMessages(xhr, onSuccess, onErr);
    });

    xhr.addEventListener('error', function () {
      onErr('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onErr('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    xhr.open('GET', 'https://1510.dump.academy/kekstagram/data');
    xhr.send();
  };

  backendLoad(window.picture.fillPicturesContainerFromServer, window.picture.filterPictures, window.util.onError, window.util.serverEventsHandler);

  var backendSave = function (data, onLoad, onErr, addMessages) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    var onSuccess = function () {
      onLoad(xhr.response);
      window.form.resetForm(window.preview.closeUploadForm);
    };

    xhr.addEventListener('load', function () {
      addMessages(xhr, onSuccess, onErr);
    });

    xhr.addEventListener('error', function () {
      onErr('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onErr('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('POST', 'https://1510.dump.academy/kekstagram');
    xhr.send(data);
  };

  return {
    backendSave: backendSave
  };
})();

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
