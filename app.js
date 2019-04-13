'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');

var app = express();

/************************** ********/
/* Configuration server variables  *
/************************** ********/
const pathApi = `/api`;

/************************** **************************/
/* Configuration body and cookie parses - middleware *
/************************** **************************/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cookieParser());

app.use(expressValidator());
/************************** ********/
/*       Configuration header      *
/************************** ********/
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin');
  response.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
  );
  response.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE'
  );
  response.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});

/************************** ********/
/*           Import routes         *
/************************** ********/
const test_route = require('./src/routes/testRoute');
const user_route = require('./src/routes/userRoute');

/************************** ********/
/*           Load routes           *
/************************** ********/
app.use(pathApi, test_route);
app.use(pathApi, user_route);

module.exports = app;
