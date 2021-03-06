'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

//manipular archivos
const fs = require('fs');
var path = require('path');

function pruebasControlador(req,res){

    res.status(200).send({message:'probando controlador de usuario'});
}

function addUser(req,res){

    var user = new User();
    var params = req.body;

    user.firstName = params.firstName;
    user.surName = params.surName;
    user.email = params.email;
    user.image = params.image;
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

function uploadImage(req,res){

    var userId = req.params.id;
    var file_name ='No Subida..';

    if(req.files){
        var file_path = req.files.image.path;
        //extraemos el nombre de toda la imagen
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        //extraemos solo la extension de la imagen
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext =='jpg' || file_ext == 'png'){

            User.findByIdAndUpdate(userId,{image:file_name},(err,userUpdate)=>{

                if(!userUpdate){
                    res.status(404).send({message:'No se ha podido actualizar el usuario con la Imagen!.'});
                }
                else{
                    res.status(200).send({user:userUpdate});
                }
            })
        }
        else{
            res.status(200).send({message:'Formato de imagen no Soportado!.'});
            //metodo para eliminar el archivo en caso que no sea la extension.
            fs.unlinkSync(file_path);
            console.log('successfully deleted',file_path);
        }
        console.log(file_path);
    }
    else{
        res.status(200).send({message:'No se ha subido ninguna imagen.'});
    }
}

function getImageFile(req,res){

    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    if(fs.existsSync(path_file)) {

        res.sendFile(path.resolve(path_file));
    }
    else{
        res.status(500).send({message:'No existe la iamgen.'});
    }
    
}

module.exports ={
    pruebasControlador,
    addUser,
    loginUser,
    searchUserId,
    updateUser,
    uploadImage,
    getImageFile
}