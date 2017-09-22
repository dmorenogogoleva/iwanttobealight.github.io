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

