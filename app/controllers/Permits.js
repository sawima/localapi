var mongoose = require('mongoose'),
	_ = require('underscore'),
    Permits = mongoose.model('Permit');
    // Users = mongoose.model('User'),
    // async = require('async');

exports.permit = function(req,res,next,id) {
	Permits.findOne({_id:id},function(err,permit) {
	   if (err) {
	      return next(err);
	    }
	    else if(!permit){
	      return next(new Error('Failed to load permit'));
	    }
	    req.permit=permit;
	    next();
	});
};

exports.allPermits = function(req,res) {
	Permits.find({}).select('permitname').exec(function(err,docs) {
		res.render('admin/permits',{permits:docs});
	});
};

exports.newPermit = function(req,res) {
	var permit = new Permits(req.body);
	permit.save(function(err) {
		if(!err){
			res.redirect('/permits');
		}
	});
};

exports.removePermit = function(req,res) {
	var permit = req.permit;
	permit.remove(function(err) {
     if (err) {
        res.render('error', {
            status: 500
        });
    } else {
      res.redirect('/permits');
    }
  });
};