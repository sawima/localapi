var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs'),
    path = require('path'),
    logger = require('morgan'),
    http = require('http'),
    qs = require('querystring');

var app =  express(),
    apirouter=express.Router(),
    config=require('./config/config');

var schedule = require('node-schedule');

var tokenSchema = new Schema({
  token:String
// },{
//   capped:{
//     size:4096,
//     max:1
//   }
});

mongoose.model('Token', tokenSchema);

var CouponSchema ={
  name:String,
  details:[{
    depositNum:Number, 
    grantNum:Number,
    remark:String,
    description:String,
  }],
  dtype:{     //新会员充值优惠或日常充值优惠
    type:String,
    enum:['newmember','deposit']
  }
};

mongoose.model('Store',new Schema({
  storeId:String,
  storeCode: String,
  storeName:String,
  storeNameCN:String,
  newMemberCoupon:CouponSchema,
  depositCoupon:CouponSchema
// },{
//   capped:{
//     size:4096,
//     max:1
//   }
}));



var Token=mongoose.model('Token');

var Store=mongoose.model('Store');


var j = schedule.scheduleJob(config.scheduleTokenStr, function(){
  // console.log('The answer to life, the universe, and everything!');
  //here is the cron task to update token
  // http.get()

  var postData = JSON.stringify({
  'account' : config.account,
  'password' : config.password
  });

  var options = {
    hostname: config.centralServer,
    port: config.centralServerPort,
    path: config.centralServerAuthPath,
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      // console.log(`BODY: ${chunk}`);
      //save data to db
      // console.log(chunk);
      var getdata=JSON.parse(chunk);
      var token = new Token({token:getdata.token});
      token.save();
    });
    res.on('end', () => {
      console.log('No more data in response.')
    })
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();

});

//sync store and coupons
var jsync = schedule.scheduleJob(config.scheduleStoreStr, function(){
  // console.log('The answer to life, the universe, and everything!');
  //here is the cron task to update token
  // http.get()

  var postData = JSON.stringify({
  'account' : config.account,
  'password' : config.password
  });

  //todo: promise get token
  var token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NmM3ZDQyNjFiYjY4YWIwMzBhNDczMDEiLCJzdG9yZUNvZGUiOiJDTlNISjAwMSIsInN0b3JlTmFtZSI6IlJpdmVyIiwic3RvcmVOYW1lQ04iOiLmiZHlk6fot68iLCJzdG9yZVR5cGUiOiJEaXJlY3QiLCJsb2MiOltdLCJpYXQiOjE0NTY4ODk3MzcsImV4cCI6MTQ1Njk3NjEzN30.046URuZeS481yYWaf4F7MlnEJ2HwcvsemmKvFd4SS2E';

  var options = {
    hostname: config.centralServer,
    port: config.centralServerPort,
    path: config.centralServerSyncPath+"/?token="+token,
    method: 'POST',
    // query:qs.stringify({token:token}),
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      // console.log(`BODY: ${chunk}`);
      //save data to db
      // console.log(chunk);
      var getdata=JSON.parse(chunk);

      console.log("(((((((((((((((((((((((((((((((((((((");
      console.log(getdata.store);
      var store = new Store(getdata.store);
      // var coupons = new Store(getdata.store);
      store.save();
    });
    res.on('end', () => {
      console.log('No more data in response.')
    })
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();

});



// mongoose.connect("mongodb://127.0.0.1:27017/mpstoken",{safe:true});
mongoose.connect(config.db,{safe:true});

app.use(logger('dev'));


//this part is for REST remote access
apirouter.use(function(req,res,next) {
 // res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Origin', 'http"://127.0.0.1');
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 next();
});  



apirouter.route('/gettoken').get(function(req,res) {
  Token.findOne(function(err,token) {
    if(err) throw err;
    res.json({token:token.token});
  });
 });

// require('./config/apirouters')(apirouter);

app.use('/',apirouter);

module.exports = app;


