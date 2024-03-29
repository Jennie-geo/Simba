import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createAccount from './routes/account';
import transactionRouter from './routes/transaction';
import usersRouter from './routes/signup';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

const corsOptions = {
  origin: process.env.FRONTEND_ROOT_URL,
  // origins: process.env.UI_ROOT_URL,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
// });
// app.use("/", indexRouter);
app.use('/', usersRouter);
app.use('/', createAccount);
app.use('/transact', transactionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ Error: 'Page Not Found' });
});

export default app;
