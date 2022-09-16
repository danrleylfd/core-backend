const express = require('express');
const authMiddleware = require('../middlewares/auth');

const readMany = require('../views/sample/readMany');

const routes = express.Router();

routes.use(authMiddleware);

routes.get('/', readMany);

module.exports = app => app.use('/samples', routes);
