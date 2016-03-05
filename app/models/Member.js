/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var MemberSchema = new Schema({
	//card
  physicalId:String,
  cardId:String,
  balance:Number,  //余额
  newDeposit:Number,  //最近一次充值金额
  newGrant:Number,   //最近一次赠送金额
  status:{
  	type:String,
  	enum:["inuse",'disabled','deleted'],
  	default:'inuse'
  },
  level:String,   //钻石会员，金卡会员，银卡会员，普通会员，diamond,gold,silver,copper,regular
  expired:Date,
  //member
  member_id:String,
  mobile:{type:String,required:true},
  name:String,
  age:Number,
  birth:Date,
  joinedAt:{type:Date,default:Date.now},
  gender:String
});

mongoose.model('Member', MemberSchema);
