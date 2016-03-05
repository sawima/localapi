var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var ExpenseRecordSchema = new Schema({
  memberCard:{
    ref:'MemberCard',
    type:Schema.ObjectId
  },
  store:{
    ref:"Store",
    type:Schema.ObjectId
  },
  happendAt:Date,
  uploadAt:{ type: Date, default: Date.now },
  category:String,
  amount:Number,
  balance:Number
  // machine:{
  //   type:Schema.ObjectId,
  //   ref:'Machine'
  // }
});

mongoose.model('ExpenseRecord', ExpenseRecordSchema);
