'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const number = Schema({
  number: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed'], require: true },
  code: { type: Number, required: true },
  dateRegister: { type: Number, required: false },
  dateConfirm: { type: Number, required: false }
});

module.exports = mongoose.model('numbers', number);
