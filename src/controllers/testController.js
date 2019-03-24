'use strict';
const bcrypt = require('bcrypt-nodejs');
const testSchema = require('../mongooseModels/testMongo');

function test(request, response) {
  //console.log(request);
  response.status(200).send({ message: 'All will be ok, only keep on' });
}

function saveTest(request, response) {
  const testModel = new testSchema();
  const { name, password } = request.body;
  testModel.name = name;
  testModel.password = password;
  testModel.save((error, test) => {
    if (error) {
      response
        .status(500)
        .send({ message: 'There is a problem with the server, try again' });
    } else {
      if (test) {
        response.status(200).send({ message: 'Test created', test });
      } else {
        response
          .status(500)
          .send({ message: 'There is a problem with the server, try again' });
      }
    }
  });
} // End saveTest

module.exports = { test, saveTest };
