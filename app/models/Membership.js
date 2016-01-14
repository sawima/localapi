/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Membership Card Schema
 */
var MembershipCardSchema = new Schema({
  // cardid:{type:String,required:true,unique:true},
  cardid:String,
  wechatid:String,
  mobile:{type:String,required:true},
  customerName:String,
  age:Number,
  gender:String,
  initStore:String,
  createdDate:{ type: Date, default: Date.now },
  balance:Number,
  addresses:[{type:String}],
  deposit:[{
    happendAt:{ type: Date, default: Date.now },
    payway:{type:String,default:"cash"},
    amount:Number,
    donate:{type:Number,default:0},
    agentId:String,
    store:String
  }],
  expense:[{
    happendAt:{ type: Date, default: Date.now },
    payway:{type:String,default:"cash"},
    category:String,
    amount:Number,
    agentId:String,
    store:String,
    machineid:String
  }],
  agentId:String
});

mongoose.model('Membership', MembershipCardSchema);




