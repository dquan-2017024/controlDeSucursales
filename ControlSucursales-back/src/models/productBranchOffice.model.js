'use strict'

const mongoose = require('mongoose');

const productBranchOfficeModel = mongoose.Schema({
    name: String,
    provider: String,
    stock: Number,
    sales: Number,
    branchOffice: {type: mongoose.Schema.ObjectId, ref: 'BranchOffice'},
    enterprise: {type: mongoose.Schema.ObjectId, ref: 'Enterprise'}
});

module.exports = mongoose.model('ProductBranchOffice', productBranchOfficeModel);