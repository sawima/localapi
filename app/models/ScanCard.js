var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ScanCardSchema = new Schema({
	cardid:String,
    ipaddress:String,
    scanat:{ type: Date, default: Date.now }
});


mongoose.model('ScanCard',ScanCardSchema);
