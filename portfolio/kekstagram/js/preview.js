'use strict';

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
