'use strict'

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const enterpriseRoutes = require('../src/routes/enterprise.routes');
const branchOfficeRoutes = require('../src/routes/branchOffice.routes');
const productEnterpriseRoutes = require('../src/routes/productEnterprise.routes');
const productBranchOfficeRoutes = require('../src/routes/productBranchOffice.routes');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/enterprise', enterpriseRoutes);
app.use('/branchOffice', branchOfficeRoutes);
app.use('/productEnterprise', productEnterpriseRoutes);
app.use('/productBranchOffice', productBranchOfficeRoutes);


module.exports = app;