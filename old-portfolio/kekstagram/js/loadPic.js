'use strict';

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
