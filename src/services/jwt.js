'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const { secretJWT } = require('../secretInfoNotTrack/secretInfo');

exports.createToken = user => {
  const payload = {
    sub: user._id,
    name: user.email,
    iat: moment().unix(),
    exp: moment()
      .add(12, 'h')
      .unix()
  };
  return jwt.encode(payload, secretJWT);
};
