var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var tokenSchema = new Schema({
  mytoken:String,
  timestamp:{type:Date,default:new Date()}
});

mongoose.model('Token', tokenSchema);

