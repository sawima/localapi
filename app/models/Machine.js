var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var MachineSchema = new Schema({
  machineId:String,
  ipaddress:String,
  unitPrice:Number,
  frequency:Number
});

mongoose.model('Machine', MachineSchema);
