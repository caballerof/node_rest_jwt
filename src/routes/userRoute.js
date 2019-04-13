'use strict';

const express = require('express');
const api = express.Router();
/** Validation and sanitization middleware */
const userValidation = require('../validators/userValidator');
const validationHandler = require('../validators/validationHandler');
/** Security */
const { authenticate } = require('../middlewares/authenticate');
/** Controllers */
const {
  test,
  postUser,
  userLogin,
  validateToken,
  userLogout,
  sendSms,
  verification,
  getNumbers
} = require('../controllers/userController');

api.get('/users/test', test);
api.get('/users/numbers', getNumbers);
api.post('/users/sendsms', sendSms);
api.put('/users/verification', verification);
api.post('/users', userValidation('postUser'), validationHandler, postUser);
/** */
api.get('/users/login', authenticate, validateToken);
api.get('/users/logout', authenticate, userLogout);
api.post(
  '/users/login',
  userValidation('postUser'),
  validationHandler,
  userLogin
);

module.exports = api;
