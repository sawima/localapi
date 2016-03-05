// 洗涤，烘干，熨烫，去渍，代洗，精洗，干洗

//

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var ServiceCategorySchema = new Schema({
  categoryName:String
});

mongoose.model('ServiceCategory', ServiceCategorySchema);
