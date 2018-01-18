'use strict';

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
