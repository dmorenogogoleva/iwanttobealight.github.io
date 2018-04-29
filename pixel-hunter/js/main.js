(function () {
'use strict';

const GameData = {
  TIME_FOR_ANS: 30,
  TIME_FOR_FAST_ANS: 10,
  TIME_FOR_NORMAL_ANS: 20,
  EXPIRING_TIME: 5,
  MAX_NUM_OF_LIVES: 3,
  MIN_NUM_OF_LIVES: -1,
  NUM_OF_ANSWERS: 10,
  CORRECT_ANS_POINTS: 100,
  FAST_ANS_POINTS: 150,
  SLOW_ANS_POINTS: 50,
  SAVED_LIFE_POINTS: 50,
  FAIL_POINTS: -1,
  DEFAULT_VALUE: 0,
  STEP: 1
};

const AnswerTypes = {
  PHOTO: `photo`,
  PAINTING: `painting`
};

const GameTypes = {
  SINGLE: `tinder-like`,
  DOUBLE: `two-of-two`,
  TRIPLE: `one-of-three`
};

const GameState = {
  userName: `default`,
  time: GameData.TIME_FOR_ANS,
  lives: GameData.MAX_NUM_OF_LIVES,
  answers: new Array(GameData.NUM_OF_ANSWERS).fill(`unknown`),
  level: GameData.DEFAULT_VALUE
};

const updateView = (container, view) => {
  container.innerHTML = ``;
  container.appendChild(view);
};

const renderScreen = (domElement) => {
  const central = document.querySelector(`#main`);
  central.innerHTML = ``;
  central.appendChild(domElement);
};

const addElementToBody = (domElement) => {
  const central = document.querySelector(`body`);
  central.appendChild(domElement);
};

const addElementToCentral = (domElement) => {
  const central = document.querySelector(`#main`);
  central.appendChild(domElement);
};

const createDomElement = (elementLayout) => {
  const element = document.createElement(`div`);
  element.innerHTML = elementLayout;
  return element;
};


const resetState = (state) => {
  state.time = GameData.TIME_FOR_ANS;
  state.lives = GameData.MAX_NUM_OF_LIVES;
  state.answers = new Array(GameData.NUM_OF_ANSWERS).fill(`unknown`);
  state.level = GameData.DEFAULT_VALUE;
};

const renderGameAnswers = (answers) => {
  const array = [];
  for (const answer of answers) {
    array.push(`<li class="stats__result stats__result--${answer}"></li>`);
  }
  return array;
};

const countPoints = (array, lives) => {

  let points = {
    all: GameData.DEFAULT_VALUE,
    correct: {
      num: GameData.DEFAULT_VALUE,
      points: GameData.DEFAULT_VALUE
    },
    fast: {
      num: GameData.DEFAULT_VALUE,
      points: GameData.DEFAULT_VALUE
    },
    slow: {
      num: GameData.DEFAULT_VALUE,
      points: GameData.DEFAULT_VALUE
    },
    lives: {
      num: GameData.DEFAULT_VALUE,
      points: GameData.DEFAULT_VALUE
    }
  };


  if (lives <= GameData.MIN_NUM_OF_LIVES) {
    points.all = GameData.FAIL_POINTS;
    points.fast.num = GameData.DEFAULT_VALUE;
    points.fast.points = GameData.DEFAULT_VALUE;
    points.slow.num = GameData.DEFAULT_VALUE;
    points.slow.points = GameData.DEFAULT_VALUE;
    points.lives.num = GameData.DEFAULT_VALUE;
    return points;
  }

  for (const answer of array) {

    switch (answer) {
      case `correct`: {
        points.correct += GameData.CORRECT_ANS_POINTS;
        points.all += GameData.CORRECT_ANS_POINTS;
        break;
      }
      case `fast`: {
        points.fast.num += GameData.STEP;
        points.fast.points += GameData.FAST_ANS_POINTS;
        points.all += GameData.FAST_ANS_POINTS;
        break;
      }
      case `slow`: {
        points.slow.num += GameData.STEP;
        points.slow.points += GameData.SLOW_ANS_POINTS;
        points.all += GameData.SLOW_ANS_POINTS;
        break;
      }
    }
  }

  points.lives.points = lives * GameData.SAVED_LIFE_POINTS;
  points.lives.num += lives;
  return points;
};

const preloadImages = (data) => {
  const images = [].concat(...data.map((item) => item.questions));
  const promises = images.map((image) => {
    return new Promise((resolve) => {
      const img = document.createElement(`img`);

      img.src = image.url;
      img.onload = img.onerror = () => resolve();
    });
  });

  return Promise.all(promises).then(() => data);
};

class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error(`u can't instantiate AbstractView, only concrete one`);
    }
  }

  get template() {
    throw new Error(`u don't have template to render. u need to choose template`);
  }

  get element() {
    if (!this._element) {
      this._element = this._render();
      this.bind();
    }
    return this._element;
  }

  _render() {
    return createDomElement(this.template);
  }

  bind() {
  }

}

var footer = `<footer class="footer">
  <a href="https://htmlacademy.ru" class="social-link social-link--academy">HTML Academy</a>
  <span class="footer__made-in">Сделано в
    <a href="https://htmlacademy.ru" class="footer__link">HTML Academy</a> &copy; 2016</span>
  <div class="footer__social-links">
    <a href="https://twitter.com/htmlacademy_ru" class="social-link  social-link--tw">Твиттер</a>
    <a href="https://www.instagram.com/htmlacademy/" class="social-link  social-link--ins">Инстаграм</a>
    <a href="https://www.facebook.com/htmlacademy" class="social-link  social-link--fb">Фэйсбук</a>
    <a href="https://vk.com/htmlacademy" class="social-link  social-link--vk">Вконтакте</a>
  </div>
</footer>`;

var data = {
  text: `<sup>*</sup> Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.`
};

class IntroView extends AbstractView {
  get template() {
    return `
    <div class="intro">
      <h1 class="intro__asterisk">*</h1>
      <p class="intro__motto">
        ${data.text}
      </p>
    </div>
  ${footer}`;
  }

  hide() {
    this.element.classList.add(`screen-fade-out`);
  }
}

class IntroScreen {
  constructor() {
    this.view = new IntroView();
  }

  init() {
    addElementToCentral(this.view.element);
  }

  hide() {
    this.view.hide();
  }
}

var IntroScreen$1 = new IntroScreen();

var data$1 = {
  title: `Лучшие художники-фотореалисты бросают&nbsp;тебе&nbsp;вызов!`,
  text: `Правила игры просты.
  <br> Нужно отличить рисунок&nbsp;от фотографии и сделать выбор.
  <br> Задача кажется тривиальной, но не думай, что все так просто.
  <br> Фотореализм обманчив и коварен.
  <br> Помни, главное — смотреть очень внимательно.`
};

class GreetingView extends AbstractView {
  get template() {
    return `
    <div class="greeting central--blur">
      <div class="greeting__logo">
        <img src="img/logo_big.png" width="201" height="89" alt="Pixel Hunter">
      </div>
      <h1 class="greeting__asterisk">*</h1>
      <div class="greeting__challenge">
        <h3>${data$1.title}</h3>
        <p>${data$1.text}</p>
      </div>
      <div class="greeting__continue">
        <span>
          <img src="img/arrow_right.svg" width="64" height="64" alt="Next">
        </span>
      </div>
    </div>
    ${footer}`;
  }

  bind() {
    const arrow = this.element.querySelector(`.greeting__continue`);
    arrow.addEventListener(`click`, () => this.arrowClickHandler());
  }

  arrowClickHandler() {
  }

  deleteAnimation() {
    this.element.classList.remove(`screen-fade-in`);
  }

  show() {
    this.element.classList.remove(`hidden`);
    this.element.classList.add(`screen-fade-in`);
  }
}

class GreetingScreen {
  constructor() {
    this.view = new GreetingView();
  }

  init() {
    renderScreen(this.view.element);
    this.view.arrowClickHandler = () => Application.showRulesScreen();
  }

  deleteAnimation() {
    this.view.deleteAnimation();
  }

  show() {
    this.view.show();
  }
}

var GreetingScreen$1 = new GreetingScreen();

const getHeader = (data) => {
  const emptyHearts = new Array(GameData.MAX_NUM_OF_LIVES - GameState.lives > GameData.MAX_NUM_OF_LIVES ? GameData.MAX_NUM_OF_LIVES : GameData.MAX_NUM_OF_LIVES - GameState.lives).fill(`<img src="img/heart__empty.svg" class="game__heart" alt="Life" width="32" height="32">`).join(``);

  const fullHearts = new Array(GameState.lives > GameData.DEFAULT_VALUE ? GameState.lives : GameData.DEFAULT_VALUE).fill(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="32" height="32">`).join(``);

  let layout = `
  <header class="header">
    <div class="header__back">
      <button class="back">
        <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
        <img src="img/logo_small.svg" width="101" height="44">
      </button>
    </div>`;

  if (data) {
    layout += `<h1 class="game__timer">${GameState.time}</h1>
    <div class="game__lives">
    ${emptyHearts}
    ${fullHearts}
    </div>`;
  }

  layout += `</header>`;

  return layout;
};

var data$2 = {
  title: `Правила`,
  text: `Угадай 10 раз для каждого изображения фото
  <img src="img/photo_icon.png" width="16" height="16"> или рисунок
  <img src="img/paint_icon.png" width="16" height="16" alt="">.
  <br> Фотографиями или рисунками могут быть оба изображения.
  <br> На каждую попытку отводится 30 секунд.
  <br> Ошибиться можно не более 3 раз.
  <br>
  <br> Готовы?`,
  form: {
    inputPlaceholder: `Ваше Имя`,
    buttonLabel: `Go!`
  }
};

class RulesView extends AbstractView {
  get template() {
    return `
    ${getHeader()}
    <div class="rules">
      <h1 class="rules__title">${data$2.title}</h1>
      <p class="rules__description">
        ${data$2.text}
      </p>
      <form class="rules__form">
        <input class="rules__input" type="text" placeholder="${data$2.form.inputPlaceholder}">
        <button class="rules__button continue" disabled>${data$2.form.buttonLabel}</button>
      </form>
    </div>
    ${footer}
    `;
  }


  bind() {
    const nextScreenButton = this.element.querySelector(`.rules__button`);
    const rulesInput = this.element.querySelector(`.rules__input`);
    const backToGreetingScreenButton = this.element.querySelector(`.back`);

    nextScreenButton.addEventListener(`click`, () => this.rulesButtonClickHandler(rulesInput));
    rulesInput.addEventListener(`input`, (evt) => this.rulesInputInputHandler(evt, nextScreenButton));
    backToGreetingScreenButton.addEventListener(`click`, () => this.backButtonClickHandler());
  }

  rulesButtonClickHandler() {

  }

  rulesInputInputHandler() {

  }

  backButtonClickHandler() {

  }
}

class RulesScreen {
  constructor() {
    this.view = new RulesView();
    this.state = GameState;
  }

  init() {
    renderScreen(this.view.element);

    this.view.rulesButtonClickHandler = (input) => {
      this._saveUsername(this.state, input.value);
      Application.showGameScreen();
    };

    this.view.rulesInputInputHandler = (evt, button) => {
      evt.preventDefault();
      this._toggleButton(evt, button);
    };

    this.view.backButtonClickHandler = () => Application.showGreetingScreen();
  }

  _toggleButton(evt, button) {
    if (evt.target.value.length > 0) {
      button.removeAttribute(`disabled`);
    } else {
      button.setAttribute(`disabled`, `disabled`);
    }
  }

  _saveUsername(state, name) {
    state.userName = name;
    return state;
  }
}


var RulesScreen$1 = new RulesScreen();

class GameModel {
  constructor(data) {
    this.data = data;
  }

  update(newState) {
    this.state = newState;
    return this.state;
  }

  reset(state) {
    resetState(state);
  }

  nextLevel() {
    this.state.level++;
    this.update(this.state);
  }

  checkAnswerTime(answerTime) {
    switch (true) {
      case answerTime > GameData.TIME_FOR_ANS - GameData.TIME_FOR_FAST_ANS: {
        this.state.answers.splice(this.state.level, 1, `fast`);
        break;
      }
      case answerTime > GameData.TIME_FOR_ANS - GameData.TIME_FOR_NORMAL_ANS: {
        this.state.answers.splice(this.state.level, 1, `correct`);
        break;
      }
      default: {
        this.state.answers.splice(this.state.level, 1, `slow`);
      }
    }
    this.update(this.state);
  }

  answerWrong() {
    this.state.answers.splice(this.state.level, 1, `wrong`);
    this.state.lives--;
    this.update(this.state);
  }

  tick(time) {
    this.state.time = time;
    this.update(this.state);
  }
}

const pageStats = (answers) => {
  return `
  <div class="stats">
    <ul class="stats">
      ${renderGameAnswers(answers)}
    </ul>
  </div>`;
};

class GameView extends AbstractView {
  constructor(model) {
    super(model);
    this.model = model;
    this.state = model.state || GameState;
    this.games = model.data[this.state.level];
  }

  get template() {
    let layout = `
    ${getHeader(GameState)}
    <div class="game">
    <p class="game__task">${this.games.question}</p>`;
    switch (this.games.type) {
      case GameTypes.DOUBLE:
        layout += `
        <form class="game__content">
        ${this.games.questions.map((question, i) => {
    return `
          <div class="game__option">
          <img src="${question.url}" alt="Option 1" width="${question.width}" height="${question.height}">
          <label class="game__answer game__answer--photo">
            <input name="question${i + GameData.STEP}" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer game__answer--paint">
            <input name="question${i + GameData.STEP}" type="radio" value="painting">
            <span>Рисунок</span>
          </label>
        </div>`;
  }).join(``)}
        </form>
        `;
        break;
      case GameTypes.SINGLE:
        layout += `
        <form class="game__content  game__content--wide">
        <div class="game__option">
          <img src=${this.games.questions[0].url} alt="Option 1" width="${this.games.questions[0].width}" height="${this.games.questions[0].height}">
          <label class="game__answer  game__answer--photo">
            <input name="question1" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer  game__answer--wide  game__answer--paint">
            <input name="question1" type="radio" value="painting">
            <span>Рисунок</span>
          </label>
        </div>
        </form>`;
        break;
      case GameTypes.TRIPLE:
        layout += `
        <form class="game__content  game__content--triple">
        ${this.games.questions.map((question) => {
    return `
        <div class="game__option game__option--selected">
          <img src="${question.url}" alt="${question.title}" width="${question.width}" height="${question.height}">
        </div>`;
  }).join(``)}
        </form>`;
        break;
    }

    layout += `${pageStats(this.state.answers)}</div>${footer}`;
    return layout;
  }


  bind() {
    this.updateControls();
    return super.bind();
  }

  updateLevel() {
    updateView(this.element, new GameView(this.model).element);
    this.updateControls();
  }

  updateControls() {
    this.gameTimer = this.element.querySelector(`.game__timer`);
    const gameContent = this.element.querySelector(`.game__content`);
    const backButton = this.element.querySelector(`.back`);

    gameContent.addEventListener(`click`, (evt) => this.gameContentClickHandler(evt));

    backButton.addEventListener(`click`, () => this.backButtonClickHandler());
  }

  updateTime(time) {
    this.gameTimer.textContent = time;
    if (time <= GameData.EXPIRING_TIME) {
      this.gameTimer.classList.add(`timer-fade`);
    }
  }

  gameContentClickHandler() {

  }

  backButtonClickHandler() {

  }
}

class GameTimer {
  constructor(sec) {
    this.sec = sec;
  }

  getTime() {
    return this.sec;
  }

  tick() {
    this.sec -= GameData.STEP;
    if (this.sec <= GameData.DEFAULT_VALUE) {
      return `time is over`;
    }
    return this.sec;
  }

}

var data$3 = {
  title: `Внимание! Текущая игра будет потеряна`,
  text: `Начать новую игру?`
};

class PopupView extends AbstractView {
  get template() {
    return `
    <div class="popup__overlay hidden"></div>
    <article class="popup hidden">
    <h2 class="popup__title">${data$3.title}</h2>
    <p class="popup__text">${data$3.text}</p>
    <button class="popup__button popup__button--action">новая игра</button>
    <button class="popup__button popup__button--close">отмена</button>
    </article>
    `;
  }

  bind() {
    this.popup = this.element.querySelector(`.popup`);
    this.overlay = this.element.querySelector(`.popup__overlay`);
    const actionButton = this.element.querySelector(`.popup__button--action`);
    const closeButton = this.element.querySelector(`.popup__button--close`);

    actionButton.addEventListener(`click`, () => this.actionButtonClickHandler());
    closeButton.addEventListener(`click`, () => this.closeButtonClickHandler());

  }

  actionButtonClickHandler() {

  }

  closeButtonClickHandler() {

  }

  show() {
    this.popup.classList.remove(`hidden`);
    this.overlay.classList.remove(`hidden`);
  }

  hide() {
    this.popup.classList.add(`hidden`);
    this.overlay.classList.add(`hidden`);
  }
}

class Popup {
  constructor() {
    this.view = new PopupView();
  }

  init(actionCallback, closeCallback) {
    addElementToBody(this.view.element);

    this.view.actionButtonClickHandler = () => {
      actionCallback();
      this.hide();
    };
    this.view.closeButtonClickHandler = () => {
      this.hide();
      closeCallback();
    };
  }

  show() {
    this.view.show();
  }

  hide() {
    this.view.hide();
  }
}

var Popup$1 = new Popup();

class GameScreen {
  constructor(data) {
    this.model = new GameModel(data);
    this.view = new GameView(this.model);
    this.numOfQuestions = this.model.data.length - GameData.STEP;
    this.answers = {};
    this.popup = Popup$1;

    this.view.gameContentClickHandler = (opt, evt) => this.gameContentClickHandler(opt, evt);
    this.view.backButtonClickHandler = () => this.backButtonClickHandler();
  }

  init(state = GameState) {
    this.model.update(state);
    this.view.updateLevel();
    this._startTimer(GameData.TIME_FOR_ANS);
    renderScreen(this.view.element);
  }

  _goToNextLevel() {
    if (this.model.state.lives >= GameData.DEFAULT_VALUE && this.model.state.level < this.numOfQuestions) {
      this.model.nextLevel();
      this.view.updateLevel();
      this._startTimer(GameData.TIME_FOR_ANS);
    } else {
      Application.showStatsScreen(this.model.state);
    }
  }

  _startTimer(time) {
    const gameTimer = new GameTimer(time);

    this.timer = setInterval(() => {
      this.model.tick(gameTimer.tick());
      this.view.updateTime(this.model.state.time);

      if (gameTimer.getTime() < GameData.DEFAULT_VALUE) {
        this._stopTimer();
        this.model.answerWrong();
        this._goToNextLevel();
      }

    }, 1000);
  }

  _stopTimer() {
    clearInterval(this.timer);
    this.model.state.time = GameData.TIME_FOR_ANS;
  }

  _checkAnswer(answer) {
    if (answer === `correct`) {
      this.model.checkAnswerTime(this.model.state.time);
    } else {
      this.model.answerWrong();
    }
    this.answers = {};
    this._stopTimer();
    this._goToNextLevel();
  }

  _onPopupAction() {
    Application.showGreetingScreen();
    this.model.reset(this.model.state);
  }

  _onPopupClose(time) {
    this._startTimer(time);
  }

  gameContentClickHandler(evt) {
    const levelType = this.model.data[this.model.state.level].type;
    switch (levelType) {
      case GameTypes.DOUBLE: {
        const currentNumOfQuestions = this.model.data[this.model.state.level].questions.length;

        if (evt.target.parentNode.classList.contains(`game__answer`) && evt.target.tagName === `INPUT`) {

          switch (evt.target.parentNode.querySelector(`input`)[`name`]) {
            case `question1`: {
              this.answers.answer1 = evt.target.parentNode.querySelector(`input`)[`value`] === this.model.data[this.model.state.level].questions[0].answer ? `correct` : `wrong`;
              break;
            }
            case `question2`: {
              this.answers.answer2 = evt.target.parentNode.querySelector(`input`)[`value`] === this.model.data[this.model.state.level].questions[1].answer ? `correct` : `wrong`;
              break;
            }
          }

          if (Object.keys(this.answers).length === currentNumOfQuestions) {
            if (this.answers.answer1 === `correct` && this.answers.answer2 === `correct`) {
              this.answers.answer = `correct`;
            } else {
              this.answers.answer = `wrong`;
            }
            this._checkAnswer(this.answers.answer);
          }
        }
        break;
      }
      case GameTypes.SINGLE: {
        const currentNumOfQuestions = this.model.data[this.model.state.level].questions.length;
        if (evt.target.parentNode.classList.contains(`game__answer`) && evt.target.tagName === `INPUT`) {
          this.answers.answer = evt.target.parentNode.querySelector(`input`)[`value`] === this.model.data[this.model.state.level].questions[0].answer ? `correct` : `wrong`;
        }

        if (Object.keys(this.answers).length === currentNumOfQuestions) {
          this._checkAnswer(this.answers.answer);
        }
        break;
      }

      case GameTypes.TRIPLE: {
        if (evt.target.parentNode.classList.contains(`game__option`)) {
          const userAnswer = `${evt.target.parentNode.querySelector(`img`).getAttribute(`src`)}`;
          let rightAnswer;
          let currentNumOfPhotosQuestions = 0;
          const maxNumOfPhotosQuestions = 2;

          for (const key in this.model.data[this.model.state.level].questions) {
            if (this.model.data[this.model.state.level].questions[key].answer === AnswerTypes.PHOTO) {
              currentNumOfPhotosQuestions += GameData.STEP;
            }
            if (currentNumOfPhotosQuestions < maxNumOfPhotosQuestions) {
              rightAnswer = AnswerTypes.PHOTO;
            } else {
              rightAnswer = AnswerTypes.PAINTING;
            }
            rightAnswer = this.model.data[this.model.state.level].questions[key].url;
          }

          this.answers.answer = userAnswer === rightAnswer ? `correct` : `wrong`;
          this._checkAnswer(this.answers.answer);
        }
        break;
      }
    }
  }

  backButtonClickHandler() {
    const currentTime = this.model.state.time;
    this._stopTimer();
    this.popup.init(() => this._onPopupAction(), () => this._onPopupClose(currentTime));
    this.popup.show();
  }
}

var data$4 = {
  title: {
    win: `Победа!`,
    fail: `FAIL`
  }
};

class StatsView extends AbstractView {
  constructor(state, results) {
    super();
    this.state = state;
    this.results = results;
    this.points = countPoints(this.state.answers, this.state.lives);
    this.answersIcons = renderGameAnswers(this.state.answers);
  }

  get template() {
    let layout = `${getHeader()}
    <div class="result">
      <h1>${this.state.lives <= GameData.MIN_NUM_OF_LIVES ? data$4.title.fail : data$4.title.win}</h1>
      <table class="result__table">
        <tr>
          <td class="result__number">${this.state.userName}</td>
          <td colspan="2">
            <ul class="stats">
              ${this.answersIcons}
            </ul>
          </td>
          <td class="result__points">×&nbsp;${GameData.CORRECT_ANS_POINTS}</td>
          <td class="result__total">${this.points.all}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Бонус за скорость:</td>
          <td class="result__extra">${this.points.fast.num}
            <span class="stats__result stats__result--fast"></span>
          </td>
          <td class="result__points">×&nbsp;${GameData.FAST_ANS_POINTS}</td>
          <td class="result__total">${this.points.fast.points}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Бонус за жизни:</td>
          <td class="result__extra">${this.points.lives.num}
            <span class="stats__result stats__result--alive"></span>
          </td>
          <td class="result__points">×&nbsp;${GameData.SAVED_LIFE_POINTS}</td>
          <td class="result__total">${this.points.lives.points}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Штраф за медлительность:</td>
          <td class="result__extra">${this.points.slow.num}
            <span class="stats__result stats__result--slow"></span>
          </td>
          <td class="result__points">×&nbsp;${GameData.SLOW_ANS_POINTS}</td>
          <td class="result__total">${this.points.slow.points}</td>
        </tr>
        <tr>
          <td colspan="5" class="result__total  result__total--final">${this.points.all}</td>
        </tr>
      </table>
    `;

    for (const key in this.results) {
      if (Object.keys(this.results).length > GameData.STEP) {
        layout += `<table class="result__table">
        <tr>
          <td class="result__number">${+key + GameData.STEP}.</td>
          <td>
            <ul class="stats">
            ${renderGameAnswers(this.results[key].answers)}
            </ul>
          </td>
          <td class="result__total"></td>
          <td class="result__total  result__total--final">${this.results[key].result}</td>
        </tr>
      </table>`;
      }
    }

    layout += `</div>${footer}`;

    return layout;
  }

  bind() {
    const backToGreetingScreenButton = this.element.querySelector(`.back`);
    backToGreetingScreenButton.addEventListener(`click`, () => this.backButtonClickHandler());
  }

  backButtonClickHandler() {

  }

}

class ErrorView extends AbstractView {
  constructor(error) {
    super(error);
    this.error = error;
  }

  get template() {
    return `
    <div class="error">
      <p class="error__msg">${this.error}</p>
    </div>`;
  }

  show() {
    addElementToBody(this.element);
  }
}

const SERVER_URL = `https://es.dump.academy/pixel-hunter`;

const DEFAULT_NAME = GameState.userName;
const APP_ID = 26081914;

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  } else {
    return new ErrorView(response.status).show();
  }
};

const toJSON = (res) => res.json();

class Loader {
  static loadData() {
    return fetch(`${SERVER_URL}/questions`).then(checkStatus).then(toJSON);
  }

  static loadResults(userName = DEFAULT_NAME) {
    return fetch(`${SERVER_URL}/stats/${APP_ID}-${userName}`).then(checkStatus).then(toJSON);
  }

  static saveResults(data, userName = DEFAULT_NAME) {
    const requestSettings = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': `application/json`
      },
      method: `POST`
    };
    return fetch(`${SERVER_URL}/stats/${APP_ID}-${userName}`, requestSettings).then(checkStatus);
  }
}

class StatsScreen {

  init(state) {
    const currentGameState = {
      answers: state.answers,
      lives: state.lives,
      result: state.lives <= GameData.MIN_NUM_OF_LIVES ? data$4.title.fail : countPoints(state.answers, state.lives).all
    };

    let view;

    Loader.saveResults(currentGameState, state.userName).
        then(() => Loader.loadResults(state.userName)).
        then((results) => {
          view = new StatsView(state, results);
          view.backButtonClickHandler = () => {
            resetState(state);
            Application.showGreetingScreen();
          };
        }).then(() => {
          renderScreen(view.element);
        });
  }
}

const adaptServerData = (data) => {
  return data.map(({type, question, answers}) => {
    return {
      type,
      question,
      questions: answers.map(({image, type: imageType}) => {
        return {
          url: image.url,
          width: image.width,
          height: image.height,
          answer: imageType
        };
      })
    };
  });
};

class Application {

  constructor() {
    this.NewGameScreen = GameData.DEFAULT_VALUE;
  }

  static start() {
    this.showIntroScreen();
    Loader.loadData().
        then(adaptServerData).
        then((data) => {
          return preloadImages(data);
        }).
        then((data) => {
          this.NewGameScreen = new GameScreen(data);
          return this.NewGameScreen;
        }).
        then(() => IntroScreen$1.hide()).
        then(() =>
          setTimeout(() => {
            GreetingScreen$1.init();
            GreetingScreen$1.show();
          }, 300)).
        catch(Application.showError);
  }

  static showError(error) {
    return new ErrorView(error.message).show();
  }

  static showIntroScreen() {
    Loader.loadData();
    IntroScreen$1.init();
  }

  static showRulesScreen() {
    Loader.loadData();
    GreetingScreen$1.deleteAnimation();
    RulesScreen$1.init();
  }

  static showGreetingScreen() {
    GreetingScreen$1.init();
  }

  static showGameScreen() {
    this.NewGameScreen.init();
  }

  static showStatsScreen(state) {
    new StatsScreen().init(state);
  }
}

Application.start();

}());

//# sourceMappingURL=main.js.map
