var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose=require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mealRouter=require("./routes/meals");

mongoose.connect(
    //"mongodb://localhost:27017/docChopper"
    "mongodb+srv://docchoper:2020docchoper@cluster0.tgu99.mongodb.net/mealrecord",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/meals",mealRouter);

module.exports = app;
