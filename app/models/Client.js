/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ClientSchema = new Schema({
	companyname:{type:String,required:true,unique:true},
	address:{type:String,default:""},
	phone:String,
	fax:String,
	keyperson:{type:String,default:""},
	keyperson_phone:String,
	keyperson_email:String
});

mongoose.model('Client', ClientSchema);