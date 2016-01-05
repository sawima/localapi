/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var RoleSchema = new Schema({
	rolename:String,
	users:[
		{
			type:Schema.ObjectId,
			ref:'User'
		}
	],
	permits:[
		{type:Schema.ObjectId,ref:'Permit'}
	]
});

mongoose.model('Role', RoleSchema);