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
var jwt=require('jsonwebtoken');

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

var Stores = mongoose.model('Store');
apirouter.route('/auth').post(function(req,res){
  Stores.
    findOne({
      account: req.body.account,
    }).
    exec(function(err,store){
      if (err) throw err;
      if (!store) {
        res.json({ success: false, message: 'Authentication failed. store not found.' });
      } else if (store) {
        console.log(store);
        // check if password matches
        //store.authenticate(password)
        // if (!store.authenticate(req.body.password)) {
        if (store.syncpasswd!==req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if store is found and password is right
          // create a token
          var simpleStore=_.pick(store,['storeId','storeCode','storeName','storeNameCN']);
          var token = jwt.sign(simpleStore, config.tokenSecret);
          // var token = jwt.sign(simpleStore, config.tokenSecret, {
          //   expiresIn: 8640000 // expires in 24*100 hours
          // });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });

apirouter.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    // var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    // console.log(req.query.token);
    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.tokenSecret, function(err, decoded) {          
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });      
            } else {
                // if everything is good, save to request for use in other routes
                // req.decoded = decoded;  
                req.store = decoded;  
                next();
            }
        });

    } else {
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
    }
});


// apirouter.route('/gettoken').get(function(req,res) {
//   Token.findOne(function(err,token) {
//     if(err) throw err;
//     res.json({token:token.mytoken}); 
//   });
//  });
require('./config/routers')(apirouter);

app.use('/',apirouter);

module.exports = app;




