'use strict'

const mongoose = require('mongoose');

const branchOfficeModel = mongoose.Schema({
    name: String,
    address: String,
    businessHours: String,
    phone: String,
    enterprise: {type: mongoose.Schema.ObjectId, ref:'Enterprise'}
});

module.exports = mongoose.model('BranchOffice', branchOfficeModel);