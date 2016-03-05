var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var tokenSchema = new Schema({
  mytoken:String
});

mongoose.model('Token', tokenSchema);

