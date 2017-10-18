
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roomSchema = new Schema({
  firstRoom : {type:String,default:"",required:true},
  secondRoom: {type:String,default:"",required:true},
  lastActive: {type:Date,default:Date.now},
});

mongoose.model('Room',roomSchema);
