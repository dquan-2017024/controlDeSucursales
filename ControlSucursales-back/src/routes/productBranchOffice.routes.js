'use strict'

const express = require('express');
const productBranchOfficeController = require('../controllers/productBranchOffice.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

//RUTAS PARA CLIENT
api.post('/sellProduct', mdAuth.ensureAuth, productBranchOfficeController.sellProduct);
api.get('/mostSales/:id', mdAuth.ensureAuth, productBranchOfficeController.mostSales);
api.get('/lessSales/:id', mdAuth.ensureAuth, productBranchOfficeController.lessSales);
api.get('/searchProductsByName', mdAuth.ensureAuth, productBranchOfficeController.searchProductsByName);
api.get('/searchProductsByProvider', mdAuth.ensureAuth, productBranchOfficeController.searchProductsByProvider);
api.get('/getProductBranchOffice/:id', mdAuth.ensureAuth, productBranchOfficeController.getProductBranchOffice);

module.exports = api;