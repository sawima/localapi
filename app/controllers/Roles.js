var mongoose = require('mongoose'),
	_ = require('underscore'),
    Roles = mongoose.model('Role'),
    Users = mongoose.model('User'),
    async = require('async');

exports.role = function(req,res,next,id) {
	Roles.findOne({_id:id},function(err,role) {
	   if (err) {
	      return next(err);
	    }
	    else if(!role){
	      return next(new Error('Failed to load role'));
	    }
	    req.role=role;
	    next();
	});
};

exports.allRoles = function(req,res) {
	var pagedata={};
	async.parallel([
      //get all Users
      function(callback) {
        Users.find({})
        .select('username roles')
        .populate('roles','rolename')
        .exec(function(err,users) {
          if(!err){
            pagedata.users=users;
          };
          callback();
        });
      },
      //get all Role
      function(callback) {
        Roles.find({}).select('rolename').exec(function(err,roles) {
          if(!err){
            pagedata.roles=roles;
            callback();
          }
        });
      }
    ],function(err){
      res.render('admin/roles',pagedata);
    });
	// Role.find({}).select('rolename').exec(function(err,docs) {
	// 	res.render('admin/roles',{roles:docs});
	// });
};

exports.newRole = function(req,res) {
	var role = new Roles(req.body);
	role.save(function(err) {
		if(!err){
			res.redirect('/roles');
		}
	});
};

exports.removeRole = function(req,res) {
	var role = req.role;
  console.log(role);
	role.remove(function(err) {
     if (err) {
        res.render('error', {
            status: 500
        });
    } else {
      res.redirect('/roles');
    }
  });
};

exports.getUsersFromRole = function(req,res) {

};