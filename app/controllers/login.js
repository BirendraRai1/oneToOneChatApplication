var express = require('express');
var mongoose = require('mongoose');

//middlewares
var auth = require('../../middlewares/auth.js');
var loginRouter = express.Router();

var userModel = mongoose.model('User');

module.exports.controllerFunction = function(app){

  //route for login
  loginRouter.get('/login',auth.loggedIn,function(req,res){
    res.render('login',
    {
      title:"User Login",
      user:req.session.user,
      chat:req.session.chat
    });
  });

  //route for logout
  loginRouter.get('/logout',function(req,res){

    delete req.session.user;
    res.redirect('/user/login');

  });

  //route for login
  loginRouter.post('/existingUser/login',auth.loggedIn,function(req,res){

    userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(err,result){
      if(err){
        res.render('message',
        {
          title:"Error",
          message:"Some Error Occured During Login.",
          status:500,
          error:err
        });
      }
      else if(result == null || result == undefined || result == ""){
        res.render('signup',
        {
          title:"User Signup",
          user:req.session.user
        }
        )
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


  //route for forgot password
  loginRouter.get('/forgotPassword',function(req,res){
    res.render('forgotPassword');
  });


  loginRouter.post('/changePasswordAndLogin',function(req,res){
    userModel.findOne({'email':req.body.email},function(err,userFound){
      if(err){
       res.render('message',{
        title:"Error",
        message:"server error",
        status:500,
        error:err
      });
     }
     else if(userFound==null)
     {
      res.render('signup',
      {
        title:"User Signup",
        user:req.session.user
      }
      )
    }
    else{
      if(req.body.newPassword!=req.body.confirmPassword){
       console.log("newPassword and confirmPassword should match"); 
       res.render('forgotPassword');
     }
     else{
       userFound.password =req.body.newPassword;
       userFound.save(function(){
        req.session.user=userFound;
        delete req.session.user.password;
        res.redirect('/chat');
      }); 
     }
   }
 });
  });

  app.use('/user',loginRouter);

} // login controller end
