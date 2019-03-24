'use strict';

const express = require('express');
const api = express.Router();
/** Validation and sanitization middleware */
const userValidation = require('../validators/userValidator');
const validationHandler = require('../validators/validationHandler');
/** Security */
const { authenticate } = require('../middlewares/authenticate');
/** Controllers */
const { test, postUser, userLogin } = require('../controllers/userController');

api.get('/user', authenticate, test);
api.post('/user', userValidation('postUser'), validationHandler, postUser);
api.post(
  '/user/login',
  userValidation('postUser'),
  validationHandler,
  userLogin
);

module.exports = api;
