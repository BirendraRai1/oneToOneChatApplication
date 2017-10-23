var express = require('express');
var app =express();
var http =require('http').Server(app);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');

//port setup
var port = process.env.PORT || 3000;

require('./sockets/chatAndLogin.js').sockets(http);

app.use(logger('dev'));

//parsing middlewares
app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());


//db connection
var dbPath = "mongodb://localhost/chatApplication11";
mongoose.connect(dbPath);
mongoose.connection.once('open',function(){
  console.log("Database Connection opened.");
});

//session setup
app.use(session({
  name : 'myCustomCookie',
  secret : 'myAppSecret',
  resave : true,
  httpOnly : true,
  saveUninitialized: true,
  cookie:{secure:false}
}));



//public folder as static
app.use(express.static('client'));



//views folder and setting ejs engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/app/views'));



//including models files.
fs.readdirSync("./app/models").forEach(function(file){
  if(file.indexOf(".js")){
    require("./app/models/"+file);
  }
});

//including controllers files.
fs.readdirSync("./app/controllers").forEach(function(file){
  if(file.indexOf(".js")){
    var route = require("./app/controllers/"+file);
    //calling controllers function and passing app instance.
    route.controllerFunction(app);
  }
});


//handling 404 error.
app.use(function(req,res){
  res.status(404).render('message',
  {
    title:"404",
    msg:"Page Not Found.",
    status:404,
    error:"",
    user:req.session.user,
    chat:req.session.chat
  });
});

//app level middleware for setting logged in user.

var userModel = mongoose.model('User');

app.use(function(req,res,next){

	if(req.session && req.session.user){
		userModel.findOne({'username':req.session.user.username},function(err,user){

			if(user){
        req.user = user;
        delete req.user.password;
        req.session.user = user;
        delete req.session.user.password;
        next();
      }

    });
	}
	else{
		next();
	}

});//end of set Logged In User.


http.listen(port,function(){
  console.log("Chat Application running on port:" +port);
});
