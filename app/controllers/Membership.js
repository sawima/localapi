var _ = require('underscore'),
    mongoose = require('mongoose'),
    Membership = mongoose.model('Membership');

exports.newMember = function(req,res) {
	// var member=new Membership({
	// 	customerName:req.body.customerName,
	// 	mobile:req.body.mobile,

	// })
	console.log(req.body);

	var member=new Membership(req.body);

	member.save(function(err) {
		if(err) throw err;
		res.send("ok");
	});
};