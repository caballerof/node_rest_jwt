'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = Schema({
  name: String,
  living: Boolean,
  num: Number,
  updated: { type: Date, default: Date.now },
  age: { type: Number, min: 18, max: 65 },
  array: [],
  nested: {
    stuff: { type: String, lowercase: true, trim: true }
  },
  password: String
});

module.exports = mongoose.model('testSchema', testSchema);
