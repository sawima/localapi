var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var StoreSchema = new Schema({
  storeId:String,
  storeCode: String,
  storeName:String,
  storeNameCN:String,
  timestamp:{type:Date,default:new Date()},
  newMemberCoupon:[{
    depositNum:Number, 
    grantNum:Number,
    remark:String,
    description:String
  }],
  depositCoupon:[{
    depositNum:Number, 
    grantNum:Number,
    remark:String,
    description:String
  }]
});

mongoose.model('Store', StoreSchema);

