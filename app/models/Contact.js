var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ContactSchema = new Schema({
	name:String,
    email:String,
    message:String,
    status:{
        type:String,
        default:"active"
    },
    submitted:{
        type:Date,
        default:Date.now
    }
});

//Validations
// ContactSchema.path('title').validate(function(title) {
//     return title.length;
// }, 'Title cannot be blank');


/**
 * Statics
 */
ContactSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Contact',ContactSchema);
