'use strict';

const express = require('express');
const { test, saveTest } = require('../controllers/testController');

const api = express.Router();

api.get('/test', test);
api.post('/test', saveTest);

module.exports = api;
