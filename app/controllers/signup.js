var express = require('express');
var mongoose = require('mongoose');


//middlewares
var auth = require('../../middlewares/auth.js');
var signUpRouter = express.Router();
var userModel = mongoose.model('User');
module.exports.controllerFunction = function(app){

  //route for signup
  signUpRouter.get("/signup",auth.loggedIn,function(req,res){
    res.render('signup',
                {
                  title:"User Signup",
                  user:req.session.user
                });
  });

  //api to create new user
  signUpRouter.post("/newuser/signup",auth.loggedIn,function(req,res){

    
    //create user.
    var newUser = new userModel({

      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
      });

    newUser.save(function(err,result){
      if(err){
        console.log(err);
        res.render('message',
                    {
                      title:"Error",
                      message:"Some Error Occured During Creation.",
                      status:500,
                      error:err,
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else if(result == undefined || result == null || result == ""){
        res.render('message',
                    {
                      title:"Empty",
                      message:"User Is Not Created. Please Try Again.",
                      status:404,
                      error:"",
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else{
        req.user = result;
        delete req.user.password;
        req.session.user = result;
        delete req.session.user.password;
        res.redirect('/chat');
      }
    });

  });

  app.use('/user',signUpRouter);

}//signup controller end
