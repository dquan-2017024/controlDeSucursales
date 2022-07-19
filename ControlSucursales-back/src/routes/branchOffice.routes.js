'use strict'

const express = require('express');
const branchOfficeController = require('../controllers/branchOffice.controller');
const api = express.Router();
const mdAuth = require('../services/authenticated');

//RUTAS PARA CLIENT
api.post('/createBranchOffice', mdAuth.ensureAuth, branchOfficeController.createBranchOffice);
api.put('/updateBranchOffice/:id', mdAuth.ensureAuth, branchOfficeController.updateBranchOffice);
api.delete('/deleteBranchOffice/:id', mdAuth.ensureAuth, branchOfficeController.deleteBranchOffice);
api.get('/searchBranchOffice', mdAuth.ensureAuth, branchOfficeController.searchBranchOffice);
api.get('/getBranchOffice/:id', mdAuth.ensureAuth, branchOfficeController.getBranchOffice);
api.get('/getBranchOffices', mdAuth.ensureAuth, branchOfficeController.getBranchOffices);

//RUTAS PARA ADMIN
api.get('/obtainBranchOffices/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], branchOfficeController.obtainBranchOffices);

module.exports = api;