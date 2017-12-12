'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/shop',{useMongoClient:true},(err,res)=>{

    if(err){
        throw err;
    }else{
        console.log('Conexion Exitosa a la Base de datos!.');
        app.listen(port,function(){
            console.log('Conexion http://localhost:' + port);
        })
    }
})