'use strict'

var express = require('express');
var UserController = require('../controllers/user-controller');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');//permite la carga de ficheros 
var md_upload = multipart({uploadDir:'./uploads/users'});

var api = express.Router();

api.get('/prueba',md_auth.ensureAuth, UserController.pruebasControlador);
api.post('/addUsers',UserController.addUser);
api.post('/login',UserController.loginUser);
api.post('/search-userId/:id',md_auth.ensureAuth,UserController.searchUserId);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/upload-image/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);//con md_upload se recogen las variables que lleguen por files.
api.get('/get-image/:imageFile',UserController.getImageFile);

module.exports = api;