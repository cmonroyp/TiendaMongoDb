'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = require('../key.json');

exports.ensureAuth = function(req,res,next){

    if(!req.headers.authorization){

       return res.status(403).send({message:'Lapetecion no tiene la cabecera de autenticacion.'});
    }

   var token =  req.headers.authorization.replace(/['"]+/g,'');

   //decodificamos el token 
   try {
       var payload = jwt.decode(token,secret.keyApp);

       if(payload.exp <= moment().unix()){
        return res.status(404).send({message:'el token ha expirado!.'});
       }
   } 
   catch (ex) {
       console.log(ex);
       return res.status(404).send({message:'Token no Valido.'});
   }

   req.user = payload; //todos los datos del usuario decodificado del token.

   next();//salimos del middleware
}