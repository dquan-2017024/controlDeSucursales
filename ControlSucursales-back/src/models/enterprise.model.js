'use strict'

const mongoose = require('mongoose');

const enterpriseModel = mongoose.Schema({
    name: String,
    type: String,
    town: String,
    password: String,
    role: String
});

module.exports = mongoose.model('Enterprise', enterpriseModel);