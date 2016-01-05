var _ = require('underscore'),
    mongoose = require('mongoose'),
    Client = mongoose.model('Client');

exports.client = function(req,res,next,id) {
	Client.findOne({_id:id},function(err,client) {
		if (err) {
	      return next(err);
	    }
	    else if(!client){
	      return next(new Error('Failed to load client'));
	    }
		req.client=client;
	    next();
	});
};

exports.all = function(req,res) {
	Client.find({},function(err,clients) {
		if(!err){
			res.render('admin/clients',{clients:clients});
		}
	});
};

exports.newClient = function(req,res) {
	res.render('admin/client',{client:{}});
};

exports.postNewClient = function(req,res) {
	var client = new Client(req.body);
	client.save(function(err) {
		// res.render('admin/client',{client:client});
		res.redirect('/client/'+client._id);
    });
};

exports.showClient = function(req,res) {
	var client=req.client;
	res.render('admin/client',{client:client});
};

exports.updateClient = function(req,res) {
	var client = req.client;

    client = _.extend(client,req.body);

    client.save(function(err) {
		res.redirect('/client/'+client._id);
    });
};