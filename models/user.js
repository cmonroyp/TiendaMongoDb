'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    firstName: String,
    surName: String,
    email: String,
    password: String,
    role: String,
    image:String
});

module.exports = mongoose.model('User',userSchema);