var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs'),
    path = require('path'),
    bodyParser =  require('body-parser'),
    logger = require('morgan'),
    http = require('http'),
    _ = require('lodash');

var app =  express(),
    apirouter=express.Router(),
    config=require('./config/config');
// var jwt=require('jsonwebtoken');

var schedule = require('node-schedule');

mongoose.connect(config.db,{safe:true});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Bootstrap models
var models_path = __dirname+'/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

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
          // console.log(store);
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



//this part is for REST remote access
apirouter.use(function(req,res,next) {
 res.header('Access-Control-Allow-Origin', '*');
 // res.header('Access-Control-Allow-Origin', 'http"://127.0.0.1');
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 next();
});

require('./config/routers')(apirouter);

//getStoreInfo
//getToken
//getEvents

app.use('/',apirouter);

module.exports = app;




