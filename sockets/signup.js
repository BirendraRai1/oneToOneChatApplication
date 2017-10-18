var socketio = require('socket.io');
var mongoose = require('mongoose');
var events = require('events');
var _ = require('lodash');
var eventEmitter = new events.EventEmitter();

//adding db models
require('../app/models/userSchema.js');
require('../app/models/chatSchema.js');
require('../app/models/roomSchema.js');

//using mongoose Schema models
var userModel = mongoose.model('User');

module.exports.sockets = function(http) {
  io = socketio.listen(http);
    //to verify for unique username and email at signup.
    //socket namespace for signup.
    var ioSignup = io.of('/signup');

    ioSignup.on('connection', function(socket) {
    console.log("signup connected.");

      //verifying unique username.
    socket.on('checkUname', function(uname) {
    eventEmitter.emit('findUsername', uname); //event to perform database operation.
    }); //end of checkUname event.

      //function to emit event for checkUname.
    var checkUname = function(data){
    ioSignup.to(socket.id).emit('checkUname', data); //data can have only 1 or 0 value.
    }; //end of checkUsername function.

      //verifying unique email.
    socket.on('checkEmail', function(email) {
    eventEmitter.emit('findEmail', email); //event to perform database operation.
    }); //end of checkEmail event.

      //function to emit event for checkEmail.
    var checkEmail = function(data) {
    ioSignup.to(socket.id).emit('checkEmail', data); //data can have only 1 or 0 value.
    }; //end of checkEmail function.

      //on disconnection.
      socket.on('disconnect', function() {
        console.log("signup disconnected.");
      });

    }); //end of ioSignup connection event.

    //database operations are kept outside of socket.io code.
    //event to find and check username.
    eventEmitter.on('findUsername', function(uname) {
      userModel.find({
        'username': uname
      }, function(err, result) {
        if (err) {
          console.log("Error : " + err);
        }
        else {
          //console.log(result);
          if (result == "") {
            checkUname(1); //send 1 if username not found.
          } else {
            checkUname(0); //send 0 if username found.
          }
        }
      });
    }); //end of findUsername event.

    //event to find and check Email.
    eventEmitter.on('findEmail', function(email) {
      userModel.find({
        'email': email
      }, function(err, result) {
        if (err) {
          console.log("Error : " + err);
        }
        else {
          //console.log(result);
          if (result == "") {
            checkEmail(1); //send 1 if email not found.
          } else {
            checkEmail(0); //send 0 if email found.
          }
        }
      });
    }); //end of findEmail event.

    //
    //
  return io;
}
