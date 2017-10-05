window.application = (function () {
  const counters = document.querySelectorAll('.counter');
  const counterValue = document.querySelectorAll('.counter__value');
  const itemButtons = document.querySelectorAll('.item__button');
  const items = document.querySelectorAll('.item__content');
  const scaleValueText = document.querySelector('.scale__value');
  const scaleValueWidth = document.querySelector('.scale__val');

  counters.forEach(function (counter, i) {
    counter.addEventListener('click', function (evt) {
      if (evt.target.tagName === 'BUTTON') {
        const buttonDec = counter.querySelector('.counter__button--decrement');
        const buttonInc = counter.querySelector('.counter__button--increment');
        const currentCounterValue = Number(counterValue[i].getAttribute('value'));

        if (evt.target === buttonInc) {
          counterValue[i].setAttribute('value', currentCounterValue + 1);
        }

        if (evt.target === buttonDec) {
          counterValue[i].setAttribute('value', currentCounterValue - 1);
        }

        const newCounterValue = Number(counterValue[i].getAttribute('value'));
        if (newCounterValue <= 1) {
          buttonDec.classList.add('disabled');
          buttonDec.setAttribute('disabled', 'disabled');
        } else {
          buttonDec.classList.remove('disabled');
          buttonDec.removeAttribute('disabled');
        }
      }
    });
  });

  itemButtons.forEach(function (button, i) {
    button.addEventListener('click', function () {
      button.classList.toggle('cancel');

      if (button.classList.contains('cancel')) {
        button.innerHTML = 'Вернуть';
        items[i].classList.add('disabled');
      } else {
        button.innerHTML = 'Удалить';
        items[i].classList.remove('disabled');
      }
    });
  });

  const changeScaleValue = function () {
    let scaleValueNumber = Number(document.querySelector('.scale__value').getAttribute('data-progress'));

    scaleValueWidth.style.width = `${scaleValueNumber}%`;
    scaleValueText.innerHTML = `${scaleValueNumber}%`;

    if (scaleValueNumber === 100) {
      scaleValueWidth.style.borderRadius = '10px';
    }
  };

  changeScaleValue();
})();
