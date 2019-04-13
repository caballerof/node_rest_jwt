'use strict';

const userSchema = require('../mongooseModels/userModel');
const numberSchema = require('../mongooseModels/numberMongo');
/** Configuration variables */
const {
  twilioVar: { accountSid, authToken, from }
} = require('../configurations/varConfig');
/** twilio  */
var twilio = require('twilio');
/** Date management */
const moment = require('moment');
/** Security */
const bcrypt = require('bcrypt-nodejs');
const { createToken } = require('../services/jwt');

function test(request, response) {
  const { body } = request.body;
  response.status(200).send({
    message: 'User controller working correctly...'
  });
} // End test

function verification(request, response) {
  const { to, code } = request.body;
  numberSchema.findOneAndUpdate(
    { number: to, code: code },
    { status: 'confirmed' },
    (error, result) => {
      if (error) {
        response
          .status(500)
          .send({ message: 'Server error, verification failed , try again' });
      } else {
        if (result) {
          response.status(200).send({
            message: 'Verification correct'
          });
        } else {
          response.status(500).send({
            message:
              'Server error, verification failed, no number in DB , try again'
          });
        }
      }
    }
  );
}

function getNumbers(request, response) {
  numberSchema.find({}, (error, result) => {
    if (error) {
      response
        .status(500)
        .send({ message: 'Server error, get data try again' });
    } else {
      if (result) {
        response.status(200).send({ message: 'Result', result });
      } else {
        response.status(500).send({ message: 'Server error try again' });
      }
    }
  });
}

function sendSms(request, response) {
  const { to } = request.body;
  const client = new twilio(accountSid, authToken);
  const numberMongo = new numberSchema();
  numberMongo.number = to;
  numberMongo.status = 'pending';
  numberMongo.dateRegister = moment().unix();
  numberMongo.code = Math.floor(Math.random() * 9999 + 2456);

  numberSchema.findOne({ number: to }, (err, numberGot) => {
    if (err) {
      response
        .status(500)
        .send({ message: 'Server error, not number saved, try again' });
    } else {
      if (numberGot) {
        console.log(numberGot);
        response.status(400).send({ message: 'Number registered' });
      } else {
        numberMongo.save((error, numberSaved) => {
          if (error) {
            response.status(500).send({
              message: 'Server error, save number, try again',
              error
            });
          } else {
            if (numberSaved) {
              client.messages
                .create({
                  body: `Your verification code [${
                    numberMongo.code
                  }] from the number ${to}`,
                  from,
                  to
                })
                .then(message => {
                  response
                    .status(201)
                    .send({ message: 'Number saved', result: numberSaved });
                })
                .catch(error => {
                  console.error(error);
                  response.status(500).send({
                    message: `Message did not send to ${to}`,
                    result: error
                  });
                });
            } else {
              response.status(500).send({
                message: 'Server error, not number saved, try again'
              });
            }
          }
        });
      }
    }
  });
} // End sendSms

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
              .status(201)
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

function userLogout(request, response) {
  response.cookie('token', '', { expires: new Date() }).sendStatus(200);
}

module.exports = {
  test,
  postUser,
  userLogin,
  validateToken,
  userLogout,
  sendSms,
  verification,
  getNumbers
};
