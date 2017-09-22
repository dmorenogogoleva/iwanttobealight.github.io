'use strict';

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
