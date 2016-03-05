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
  mytoken:String
});

mongoose.model('Token', tokenSchema);

mongoose.model('Store',new Schema({
  storeId:String,
  storeCode: String,
  storeName:String,
  storeNameCN:String,
  newMemberCoupon:{
    details:[{
      depositNum:Number, 
      grantNum:Number,
      remark:String,
      description:String,
    }]
  },
  depositCoupon:{
    details:[{
      depositNum:Number, 
      grantNum:Number,
      remark:String,
      description:String,
    }]
  }
// },{
//   capped:{
//     size:4096,
//     max:1
//   }
}));



var Token=mongoose.model('Token');

var Store=mongoose.model('Store');

var updateToken=function() {
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
    // console.log(`STATUS: ${res.statusCode}`);
    // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    var body="";
    res.on('data', (chunk) => {
      body+=chunk;
    });
    res.on('end', () => {
      var getdata=JSON.parse(body);
      var token = new Token({mytoken:getdata.token});
      token.save();
      console.log('Get latest token.')
    })
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
};

var j = schedule.scheduleJob(config.scheduleTokenStr, function(){
  updateToken(); 
});

var updateStoreInfo=function() {
  var postData = JSON.stringify({
  'account' : config.account,
  'password' : config.password
  });
  Token.findOne({},function(err,token) {
    if(err) throw err;
    if(token){
      var options = {
        hostname: config.centralServer,
        port: config.centralServerPort,
        path: config.centralServerSyncPath+"/?token="+token.mytoken,
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json'
          // 'Content-Length': postData.length
        }
      };
      var req = http.request(options, (res) => {
        // console.log(`STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        var body="";
        res.on('data', (chunk) => {
          body+=chunk;
        });
        res.on('end', () => {
          var getdata=JSON.parse(body);
          var store = new Store(getdata.store);
          console.log(store);
          store.save(function(err) {
            if(err) throw err;
          });
          console.log('Fresh new Store Info.')
        })
      });

      req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
      });

      // req.write(postData);
      req.end();
    }
  }); 
};

//sync store and coupons
var jsync = schedule.scheduleJob(config.scheduleStoreStr, function(){
  updateStoreInfo();
});

updateToken();
updateStoreInfo();

mongoose.connect(config.db,{safe:true});

app.use(logger('dev'));


//this part is for REST remote access
apirouter.use(function(req,res,next) {
 res.header('Access-Control-Allow-Origin', '*');
 // res.header('Access-Control-Allow-Origin', 'http"://127.0.0.1');
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 next();
});  



apirouter.route('/gettoken').get(function(req,res) {
  Token.findOne(function(err,token) {
    if(err) throw err;
    res.json({token:token.mytoken}); 
  });
 });

app.use('/',apirouter);

module.exports = app;




