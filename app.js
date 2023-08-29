var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const errorController = require('./controllers/errorController')
var indexRouter = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(errorController.getError)

module.exports = app;

const PORT = process.env.PORT || 3000
const MONGOOSE = process.env.MONGOOSE
mongoose.connect(MONGOOSE)
  .then(() => {
    console.log('La connexion à la base de données est établie')

    app.listen(PORT, () => {
      console.log('app.listen 3000')
    })
  })

  .catch(err => {
    console.log('La connexion à la base de données a échoué', err)
  })
