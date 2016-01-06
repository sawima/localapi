var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
mongoose.model('Requester', new Schema({ 
	name: String, 
	password: String
}));