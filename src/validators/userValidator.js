'use strict';
const { body } = require('express-validator/check');

function userValidation(method) {
  switch (method) {
    case 'postUser':
      return [
        body('email', 'Correo invalido')
          .exists()
          .withMessage('Parameter does not exist')
          .isEmail()
          .normalizeEmail(),
        body('password', 'Incorrect password')
          .exists()
          .withMessage('Parameter does not exist')
          .isLength({ min: 5 })
          .withMessage('Parameter needs to be minimum of 5 characters')
          .trim()
      ];
      break;
  }
}

module.exports = userValidation;
