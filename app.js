'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const api ='/api';

//cargar rutas 
var user_routes = require('./routes/route-user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cargar cabeceras http 

//ruta base
app.use(api,user_routes);

module.exports = app;