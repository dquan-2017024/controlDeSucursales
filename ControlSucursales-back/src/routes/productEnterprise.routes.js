'use strict'

const express = require('express');
const productEnterpriseController = require('../controllers/productEnterprise.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

//RUTAS PARA CLIENT
api.post('/addProduct', mdAuth.ensureAuth, productEnterpriseController.addProduct);
api.get('/getProductsEnterprise', mdAuth.ensureAuth, productEnterpriseController.getProductsEnterprise);
api.put('/updateProductEnterprise/:id', mdAuth.ensureAuth, productEnterpriseController.updateProductEnterprise);
api.delete('/deleteProductEnterprise/:id', mdAuth.ensureAuth, productEnterpriseController.deleteProductEnterprise);
api.post('/distributeProducts', mdAuth.ensureAuth, productEnterpriseController.distributeProducts);
api.get('/searchProductsByName', mdAuth.ensureAuth, productEnterpriseController.searchProductsByName);
api.get('/searchProductsByProvider', mdAuth.ensureAuth, productEnterpriseController.searchProductsByProvider);
api.get('/getProductEnterprise/:id', mdAuth.ensureAuth, productEnterpriseController.getProductEnterprise);

module.exports = api;