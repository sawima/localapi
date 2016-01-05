var _ = require('underscore'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    User = mongoose.model('User'),
    Client = mongoose.model('Client'),
    Role = mongoose.model('Role'),
    async = require('async'),
    url = require('url');
var nodemailer=require('nodemailer');
var mg=require('nodemailer-mailgun-transport');
var passport = require('passport');
var config=require('../../config/config');

exports.user = function(req,res,next,id) {
  User.findOne({_id:id})
  .select('username email phone enabled client roles')
  .populate('client','companyname')
  .populate('roles','rolename')
  .exec(function(err,user) {
    if (err) {
      return next(err);
    }
    else if(!user){
      return next(new Error('Failed to load user'));
    }
    req.account=user;
    next();
  });
};

exports.show = function(req,res) {
  var addtioninfo={};
  async.parallel([
      //get all clients
      function(callback) {
        Client.find({}).select('companyname').exec(function(err,clients) {
          if(!err){
            addtioninfo.clients=clients;
          };
          callback();
        });
      },
      //get all Role
      function(callback) {
        Role.find({}).select('rolename').exec(function(err,roles) {
          if(!err){
            addtioninfo.roles=roles;
            callback();
          }
        });
      }
    ],function(err){
      addtioninfo.account=req.account;
      console.log(addtioninfo);
      res.render('admin/user',addtioninfo);
    });
};

exports.newUser = function(req,res) {
  var addtioninfo={}
  async.parallel([
      //get all clients
      function(callback) {
        Client.find({}).select('companyname').exec(function(err,clients) {
          if(!err){
            addtioninfo.clients=clients;
          };
          callback();
        });
      },
      //get all Role
      function(callback) {
        Role.find({}).select('rolename').exec(function(err,roles) {
          if(!err){
            addtioninfo.roles=roles;
            callback();
          }
        });
      }
    ],function(err){
      addtioninfo.account={};
      res.render('admin/user',addtioninfo);
    });
};

exports.update = function(req,res) {
	var user = req.account;
  user = _.extend(user,req.body);
  user.save(function(err) {
    res.redirect('/user/'+user._id);
  });
};

// exports.destroy = function(req,res) {
//     var user = req.user;

//     user.remove(function(err) {
//       res.json(user);
//     });
// };

exports.all = function(req,res) {
  User.find({})
  .select('-salt -hashed_password -resetPasswordToken -resetPasswordExpires')
  .populate('client','companyname')
  .populate('roles','rolename')
  .exec(function(err,docs) {
    if(!err){
      // console.log(docs);
      res.render('admin/users',{accounts:docs});
    }
  });
};

exports.create = function(req,res) {
  var user =  new User(req.body);
  //Generate random password
  var random_password="";
  var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i=0;i<8;i++){
    random_password+=possible.charAt(Math.floor(Math.random()*possible.length));
  }
  var password={password:random_password};

  //simple solution is use user's phone number as initial password
  // var password={password:user.phone};
  user=_.extend(user,password);
  user.save(function(err) {
    if(!err){
      var auth={
        auth:{
          api_key:config.mailgun.api_key,
          domain:config.mailgun.domain
        }
      }
      var transporter=nodemailer.createTransport(mg(auth));
      var mailOptions = {
        to: user.email,
        from: 'yashi@kimatech.com',
        subject: 'New User Created',
        text: 'Account is created for you.\n\n' +
          'Please click on the following link to access the tool\n\n' +
          'http://' + req.headers.host + '\n\n' +
          'your login account is:'+user.email + '\n\n'+
          'your password is:' + user.password +'\n\n'+
          '\n'
      };
      transporter.sendMail(mailOptions, function(err) {
      });
      res.redirect('/user/'+user._id);
    }
  });
};

/********************************************************************/
//follow function export admin func

//reset user passwd 
exports.changePwd=function(req,res) {
  res.render('users/chpasswd');
};

exports.updatePwd = function(req,res) {
  var user = req.user;
  
  req.assert('password', '密码长度不能低于6位.').len(6);
  req.assert('confirm', '重复密码不匹配.').equals(req.body.password);
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  User.findOne({_id:user._id},function(err,t_user) {
    if(t_user.authenticate(req.body.oldpassword)){
      user.password = req.body.password;
      user.save(function(err) {
        if(!err){
          res.redirect('/');
        }
      });    
    }
    else{
      req.flash('errors',{msg:"现在使用的密码输入不正确,请重新输入!"});
      return res.redirect('back');
    }
  });
};

// //post method of reset passwd 
// exports.resetpasswd=function(req,res) {
//     var user=req.profile;
//     // console.log(user);
//     var newpasswd=req.body.newpasswd;
//     if(!_.isUndefined(newpasswd)||!_isNull(newpasswd)){
//         user.set('password',req.body.newpasswd);
//         user.save(function(err) {
//             if(!err){
//                 res.redirect('/users/list');
//             }
//         });
//     }
// };

/**
 * Show login form
 */
exports.signin = function(req, res) {
    // req.flash('info',{msg:'welcome'});
    // req.flash('errors',{msg:'error'});
    // req.flash('success',{msg:'sucess'});
    res.render('users/loginform', {
        title: 'Signin',
        // message: req.flash('error'),
        username:"null",
        user:"null"
    });
};

/**
* Post login
*/
exports.postSignin = function(req,res,next) {
  //form validation
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signin');
  }

  passport.authenticate('local',function(err,user,info) {
    if(err) return next(err);
    if(!user){
      req.flash('errors',{msg:info.message});
      return res.redirect('/signin');
    };
    // console.log(req.user || "or null");
    req.logIn(user,function(err) {
      if(err) return next(err);
      req.flash('success',{msg:"Sucess! You are logged in."});
      var returnUrl=url.parse(req.url,true);
      var targeturl= returnUrl.query.returnUrl;
      res.redirect(targeturl || '/')
    });
  })(req,res,next);
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User(),
        username:req.user?req.user.username:"null"
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/signin');
};


exports.forgot = function(req,res) {
  // res.render('users/forgotpassword',{error:req.flash('errors'),info:req.flash('info')});
  res.render('users/forgotpassword');
};

exports.handleforgot = function(req,res) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          // req.flash('error', 'No account with that email address exists.');
          req.flash('errors', {msg:'邮件地址不存在'});
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var auth={
        auth:{
          api_key:config.mailgun.api_key,
          domain:config.mailgun.domain
        }
      }
      var transporter=nodemailer.createTransport(mg(auth));
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@kimatech.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', {msg:'重置密码邮件已发送至您的邮箱 ' + user.email});
        // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
};


exports.reset = function(req,res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('errors', {msg:'重置密码请求已失效.'});
      // req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('users/reset', {
      user: req.user
      // error:req.flash('errors')
    });
  });
};

exports.handlereset = function(req,res) {
  req.assert('password', '密码长度不能低于6位.').len(6);
  req.assert('confirm', '重复密码不匹配.').equals(req.body.password);
  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }


  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          // req.flash('error', 'Password reset token is invalid or has expired.');
          req.flash('errors', {msg:'重置密码请求已失效.'});

          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          req.logIn(user, function(err) {
            done(err, user);
          });
        });
      });
    },
    function(user, done) {
      var auth={
        auth:{
          api_key:config.mailgun.api_key,
          domain:config.mailgun.domain
        }
      }
      var transporter=nodemailer.createTransport(mg(auth));
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@kimatech.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', {msg:'Success! Your password has been changed.'});
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
};