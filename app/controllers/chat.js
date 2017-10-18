var express = require('express');
var chatRouter = express.Router();

var auth = require('../../middlewares/auth.js');


module.exports.controllerFunction = function(app){

  //route for chat
  chatRouter.get('/chat',auth.checkLogin,function(req,res){

    res.render('chat',
                {
                  title:"Chat Home",
                  user:req.session.user,
                  chat:req.session.chat
                });
  });

  app.use(chatRouter);

}//Chat controller end.
