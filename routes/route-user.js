'use strict'

var express = require('express');
var UserController = require('../controllers/user-controller');
var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/prueba',md_auth.ensureAuth, UserController.pruebasControlador);
api.post('/addUsers',UserController.addUser);
api.post('/login',UserController.loginUser);

module.exports = api;