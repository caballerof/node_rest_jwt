'use strict';

const objError = {
  param: '',
  msg: ''
};

function validationHandler(request, response, next) {
  request
    .getValidationResult()
    .then(result => {
      if (result.isEmpty()) {
        next();
      } else {
        const errors = result.array().map(i => {
          objError.param = i.param;
          objError.msg = i.msg;
          const error = objError;
          return error;
        });
        return response
          .status(400)
          .send({ message: 'Error validation', errors });
      }
    })
    .catch(error => {
      response.status(500).send({ message: 'Error validation', error });
    });
} // End validationHandler

module.exports = validationHandler;
