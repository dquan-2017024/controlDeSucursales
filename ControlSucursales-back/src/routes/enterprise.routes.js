'use strict'

const express = require('express');
const enterpriseController = require('../controllers/enterprise.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

//RUTAS PÚBLICAS
api.post('/login', enterpriseController.login);

//RUTAS PARA ADMIN
api.post('/createEnterprise', [mdAuth.ensureAuth, mdAuth.isAdmin], enterpriseController.createEnterprise);
api.get('/getEnterprises', [mdAuth.ensureAuth, mdAuth.isAdmin], enterpriseController.getEnterprises);
api.put('/updateEnterprise/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], enterpriseController.updateEnterprise);
api.delete('/deleteEnterprise/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], enterpriseController.deleteEnterprise);
api.get('/getEnterprise/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], enterpriseController.getEnterprise);

module.exports = api;