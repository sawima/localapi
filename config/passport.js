var LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    async = require('async');

module.exports = function(passport) {
    //Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        // User.findOne({_id:id})
        // .select('username email enabled roles')
        // .populate('roles','rolename permits')
        // .exec(function(err,user) {
        //     done(err,user);
        // });
        User.findOne({_id:id})
        .select('username email enabled roles')        
        .populate({path:'roles',select:'-_id rolename permits'})
        .exec(function(err,docs) {
            var options={
                path:'roles.permits',
                select:'-_id permitname',
                model:'Permit'
            };
            User.populate(docs,options,function(err,user) {
                done(err,user)
            });
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({
                email: email,
                enabled:true
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        // message: 'Unknown user'
                        message:'用户不存在'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        // message: 'Invalid Password'
                        message:'密码不正确'
                    });
                }
                return done(null, user);
            });
        }
    ));
};