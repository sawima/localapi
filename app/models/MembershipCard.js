/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Membership Card Schema
 */
var MembershipCardSchema = new Schema({
  cardid:{type:String,required:true,unique:true},
  userName:String,
  age:Number,
  gender:String,
  mobile:String,
  initStore:String,
  createdDate:Date,
  balance:Number,
  deposit:{
    happendAt:Date,
    payway:String,
    amount:Number,
    agentId:String
  },
  expense:{
    happendAt:Date,
    category:String,
    amount:Number,
    agentId:String
  },
  agentId:String
});

mongoose.model('MembershipCard', MembershipCardSchema);




