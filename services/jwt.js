'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_tienda' //require('../key.json');

exports.createToken = function(user){
//console.log(secret);
    var payload ={
        sub: user._id,
        firstName: user.firstName,
        surName: user.surName,
        email: user.email,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30,'days').unix
    }

    return jwt.encode(payload,secret);
}