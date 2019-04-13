'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const { secretJWT } = require('../secretInfoNotTrack/secretInfo');

exports.authenticate = (request, response, next) => {
  const token =
    request.body.token ||
    request.query.token ||
    request.headers['x-access-token'] ||
    request.cookies.token;

  if (!token) {
    return response.status(401).send({ message: 'Token is requiere' });
  }

  try {
    var payload = jwt.decode(token, secretJWT);
  } catch (error) {
    return response
      .status(400)
      .send({ message: 'Token is requiere', error: error['message'] });
  }

  request.user = payload;

  next();
};
