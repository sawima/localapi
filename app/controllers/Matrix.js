var mongoose = require('mongoose'),
	_ = require('underscore'),
    Roles = mongoose.model('Role'),
    Permits = mongoose.model('Permit'),
    async = require('async');

exports.matrix = function(req,res) {
	var pagedata={};
	async.parallel([
      //get all Users
      function(callback) {
        Permits.find({})
        .select('permitname')
        .exec(function(err,permits) {
          if(!err){
            pagedata.permits=permits;
          };
          callback();
        });
      },
      //get all Role
      function(callback) {
        Roles.find({})
        .select('rolename permits')
        .sort('rolename')
        .exec(function(err,roles) {
          if(!err){
            pagedata.roles=roles;
            callback();
          }
        });
      }
    ],function(err){
      res.render('admin/matrix',pagedata);
    });
};

exports.saveMatrix = function(req,res) {
  console.log(req.body.docs);
  var roleandpermit=req.body.docs;

  _.each(roleandpermit,function(value,index){
    Roles.update({_id:value._id},{permits:value.permits},function(err) {
      if(err){
        console.log(err);
      }
    });
  });
  res.redirect('/matrix');
};