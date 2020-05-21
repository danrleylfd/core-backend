const express = require('express');
const routes = express.Router();
const Auth = require('../views/auth');

routes.post('/signup', Auth.signUp);

routes.post('/signin', Auth.signIn);

routes.post('/forgot_password', Auth.forgotPassword);

routes.post('/reset_password', Auth.resetPassword);

module.exports = app => app.use('/auth', routes);
