var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({

	username : {type:String,default:"",required:true},
	email    : {type:String,default:"",required:true},
	password : {type:String,default:"",required:true},
	created  : {type:Date,default:Date.now}
});
mongoose.model('User',userSchema);
