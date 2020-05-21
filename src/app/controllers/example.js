const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Example = require('../views/example');

const routes = express.Router();

routes.use(authMiddleware);

routes.get('/', Example.read);

module.exports = app => app.use('/examples', routes);