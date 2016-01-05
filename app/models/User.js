var mongoose = require('mongoose'),
    crypto = require('crypto'),
	Schema = mongoose.Schema,
    _ = require('lodash');

var UserSchema = new Schema({
	username: String,
    email: {
        type:String,
        unique:true
    },
    hashed_password: String,
    salt: String,
    phone: String,
    client: {
        type:Schema.ObjectId,
        ref:'Client'
    },
    resetPasswordToken:String,
    resetPasswordExpires:Date,
    roles:[{
        type:Schema.ObjectId,
        ref:'Role'
    }],
    enabled:{
        type:Boolean,
        default:true
    }
});


/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
// UserSchema.pre('save', function(next) {
//     if (!this.isNew) return next();

//     if (!validatePresenceOf(this.password))
//         next(new Error('Invalid password'));
//     else
//         next();
// });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
       return crypto.randomBytes(16).toString('base64'); 
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },

    /***
        role method for user
    **/
    orderPermit:function() {
        //todo: find permit name "user" in user
        return this.getPermit('订单');
    },
    userPermit:function() {
        return this.getPermit('用户');
    },
    productPermit:function() {
        return this.getPermit('产品');
    },
    getPermit:function(pname) {
        var result=false;
        for(var i=0;i<this.roles.length;i++){
            var permits=this.roles[i].permits;
            for (var j = 0; j<permits.length;j++) {
                var permit=permits[j];
                if(permit.permitname==pname){
                    result=true;
                    return result;
                }
            };
        }
        return result;
    }
};

/**
 * Statics
 */
UserSchema.statics.load = function(id, cb) {
    this.findOne({_id: id}).select("username email phone enabled").exec(cb);
};


mongoose.model('User',UserSchema);