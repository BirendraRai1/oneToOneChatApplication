var express = require('express');
var mongoose = require('mongoose');


var homeRouter = express.Router();

var userModel = mongoose.model('User');

module.exports.controllerFunction = function(app){

  //router for home.
  homeRouter.get('/',function(req,res){
  	res.redirect('/user/login');
  });

  app.use(homeRouter);

}//home controller end.
