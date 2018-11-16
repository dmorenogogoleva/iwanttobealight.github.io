var createError = require('http-errors');
var express = require('express');
require(`dotenv`).config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const router = express.Router();

const corsRoute = require(`./route/cors`);

var { validatePort } = require('./helpers');

var app = express();
corsRoute(router);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

router.use((err, req, res, next) => {
  next(err, req, res);
});

const runServer = function (port) {
  const validatedPort = validatePort(port);

  if (validatedPort) {
    app.listen(validatedPort,
      () => console.log(`Сервер запущен: http://localhost:${validatedPort}`))
  } else {
    throw new Error('port must be a number')
  }
}

runServer(process.env.SERVER_PORT);
