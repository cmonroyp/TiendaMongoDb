'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebasControlador(req,res){

    res.status(200).send({message:'probando controlador de usuario'});
}

function addUser(req,res){

    var user = new User();
    var params = req.body;

    user.firstName = params.firstName;
    user.surName = params.surName;
    user.email = params.email;
    //user.password = params.password;
    user.role = params.role;

    if(params.password){
        //encryptar contraseña
        bcrypt.hash(params.password,null,null,function(err,hash){

            user.password = hash;
            if(user.firstName != null && user.email != null){

                //Guarda el Usuario
                user.save((err,userStored)=>{
                    if(err){
                        res.status(500).send({message:'Error guradando el Usuario!.'}); 
                    }
                    else{
                        if(!userStored){
                            res.status(404).send({message:'No se ha almacenado el Usuario!.'});
                        }
                        else{
                            res.status(200).send({user:userStored});
                            console.log(userStored);
                        }
                    }
                })
            }
            else{
                res.status(200).send({message:'Intoduce todos los Campos!.'});
            }
        })

    }else{
        res.status(200).send({message:'Introduce la Contraseña!.'});
    }
}

function loginUser(req,res){

    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()},(err,user)=>{

        if(err){
            res.status(500).send({message:'Error en la peticion de Busqueda'});
        }
        else{
            if(!user){
                res.status(404).send({message:'El usuario no existe!.'});
            }
            else{
                //comprobar la contraseña 
                bcrypt.compare(password,user.password,(err,check)=>{

                    if(check){
                        //devuelve datos usuario logueado
                        if(params.gethash){
                            //devuelve token jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            })
                        }
                        else{
                            res.status(200).send({user}); 
                        }
                    }
                    else{
                        res.status(404).send({message:'Datos incorrectos del usuario.'});
                    }
                })
            }
        }
    })
}

function searchUserId(req,res){

    var userId = req.params.id;
    console.log(userId)

    User.findById(userId,(err,findUser)=>{

        if(err){
            res.status(500).send({message:'Error Buscando el Usuario'});
        }
        else{
            if(!findUser){
                res.status(404).send({message:'No existe el Usuario!.'});
            }
            else{
                res.status(200).send({user: findUser});
            }
        }
    })
}

function updateUser(req,res){

    var userId = req.params.id;
    var params = req.body;


    User.findByIdAndUpdate(userId,params,(err, userUpdate)=>{
        if(err){
            res.status(500).send({message:'Error al actualizar el usuario'});
        }
        else{
            if(!userUpdate){
                res.status(404).send({message:'No se ha podido actualizar el usuario!.'});
            }
            else{
                res.status(200).send({user:userUpdate});
            }
        }
    })
}

module.exports ={
    pruebasControlador,
    addUser,
    loginUser,
    searchUserId,
    updateUser
}