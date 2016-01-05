/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var PermitSchema = new Schema({
	permitname:String
});

mongoose.model('Permit', PermitSchema);