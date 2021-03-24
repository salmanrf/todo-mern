const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const todoRouter = require("./routes/todoRouter");
const authRouter = require("./routes/authRouter");
const tokenRouter = require("./routes/tokenRouter");

const app = express();

app.use(cors({origin: ["http://127.0.0.1:3000", "http://localhost:3000"], credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/todo', todoRouter);
app.use('/api/auth', authRouter);
app.use('/api/token', tokenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
