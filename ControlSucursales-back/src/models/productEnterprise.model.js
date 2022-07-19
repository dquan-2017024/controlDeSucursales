'use strict'

const mongoose = require('mongoose');

const productEnterpriseModel = mongoose.Schema({
    name: String,
    provider: String,
    stock: Number,
    enterprise: {type: mongoose.Schema.ObjectId, ref: 'Enterprise'}
});

module.exports = mongoose.model('ProductEnterprise', productEnterpriseModel);