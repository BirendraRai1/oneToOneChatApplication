var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatSchema = new Schema({

  sender   : {type:String,default:"",required:true},
  receiver : {type:String,default:"",required:true},
  message  : {type:String,default:"",required:true},
  room     : {type:String,default:"",required:true},
  createdOn: {type:Date,default:Date.now}

});

mongoose.model('Chat',chatSchema);
