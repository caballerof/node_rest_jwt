'use strict';

const userSchema = require('../mongooseModels/userModel');
/** Date management */
const moment = require('moment');
/** Security */
const bcrypt = require('bcrypt-nodejs');
const { createToken } = require('../services/jwt');

function test(request, response) {
  const { body } = request.body;
  response.status(200).send({
    message: 'User controller working correctly...',
    body
  });
} // End test

/**
 * Add new user to the DB and return the user object created.
 *
 * @param {Object} request  represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param {Object} response represents the HTTP response that an Express app sends when it gets an HTTP request.
 */
function postUser(request, response) {
  const { email, password } = request.body;
  var salt = bcrypt.genSaltSync(9);
  const user = new userSchema();
  user.email = email;

  bcrypt.hash(password, salt, null, (error, result) => {
    if (error) {
      response
        .status(500)
        .send({ message: 'Server error encrypt, try again', error });
    } else {
      user.password = result;
      user.save((errorS, userSaved) => {
        if (errorS) {
          response
            .status(500)
            .send({ message: 'Server error, save user, try again', error });
        } else {
          if (userSaved) {
            response
              .status(200)
              .send({ message: 'User saved', result: userSaved });
          } else {
            response
              .status(500)
              .send({ message: 'Server error, not user saved, try again' });
          }
        }
      });
    }
  });
} // End postUser

function userLogin(request, response) {
  const { email, password } = request.body;

  userSchema.findOne({ email: email }, (error, user) => {
    if (error) {
      response.status(500).send({ message: 'User was not find', error });
    } else {
      if (user) {
        bcrypt.compare(password, user.password, (err, check) => {
          if (check) {
            //response.status(200).send({ message: 'Usuario correcto' });
            response
              .cookie('token', createToken(user), {
                expires: 0,
                httpOnly: true
              })
              .sendStatus(200);
          } else {
            response
              .status(400)
              .send({ message: 'User could not log', result: email, user });
          }
        });
      } else {
        response
          .status(400)
          .send({ message: 'User don not exist', result: email });
      }
    }
  });
} // End userLogin

function validateToken(request, response) {
  const { sub: id, name } = request.user;
  response
    .status(200)
    .send({ message: 'keep calm and carry on', result: { id, name } });
} // End validateToken

module.exports = {
  test,
  postUser,
  userLogin,
  validateToken
};
