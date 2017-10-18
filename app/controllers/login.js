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
                      error:err,
                      user:req.session.user,
                      chat:req.session.chat
                    });
      }
      else if(result == null || result == undefined || result == ""){
        res.render('message',
                    {
                      title:"Error",
                      message:"User Not Found. Please Check Your Username and Password.",
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

  app.use('/user',loginRouter);

} // login controller end
