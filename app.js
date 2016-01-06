var express = require('express'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    favicon = require('serve-favicon'),
    bodyParser =  require('body-parser'),
    expressValidator = require('express-validator'),
    logger = require('morgan'),
    passport = require('passport'),
    helpers = require('view-helpers'),
    flash = require('express-flash'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    methodOverride = require('method-override');

var app =  express(),
    apirouter=express.Router(),
    router = express.Router(),
    auth = require('./config/middlewares/authorization'),
    permission = require('./config/middlewares/permission'),
    config=require('./config/config');


var jwt=require('jsonwebtoken');

app.locals._=require('lodash');
app.set('superSecret', config.secret);

mongoose.connect("mongodb://127.0.0.1:27017/mpsapi",{safe:true});


app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// method override 
// input(type='hidden',name='_method',value='PUT')
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator());

app.use(session({
    secret: "Kima",
    store: new MongoStore({
      // url:process.env.MONGO_URL,
      url:"mongodb://127.0.0.1:27017/mpsapi",
      db : "sessions"
    }),
    saveUninitialized:true,
    resave:true
  }));
app.use(flash());

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

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});


//this part is for REST remote access
apirouter.use(function(req,res,next) {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
 next();
});  

var Requester = mongoose.model('Requester');


apirouter.route('/setup').get(function(req,res) {
    var nick = new Requester({ 
      name: 'james', 
      password: 'password',
      admin: true 
    });
    nick.save(function(err) {
      if (err) throw err;

      console.log('User saved successfully');
      res.json({ success: true });
    });
});

apirouter.route('/auth').get(function(req,res) {
    res.send(config.tokenSecret);
  }).post(function(req,res) {
      // find the user
      console.log('get user and password from remote');
      // console.log(req.body.username);
      // console.log(req.body.password);
      Requester.findOne({
        name: req.body.username
      }, function(err, user) {

        if (err) throw err;

        // console.log(user);

        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

          // check if password matches
          //user.authenticate(password)
          if (user.password!==req.body.password) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.' });
          } else {

            // if user is found and password is right
            // create a token
            var token = jwt.sign(user, config.tokenSecret, {
              expiresInMinutes: 1440 // expires in 24 hours
            });

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
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.tokenSecret, function(err, decoded) {          
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });      
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                console.log(decoded);
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.'
        });
        
    }
    
});


require('./config/routers')(router,passport,auth,permission);
require('./config/apirouters')(apirouter);

app.use('/api',apirouter)
app.use('/',router);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

// app.use(function(err, req, res, next) {
//     //Treat as 404
//     if (~err.message.indexOf('not found')) return next();

//     //Log it
//     console.error(err.stack);

//     //Error page
//     res.status(500).render('500', {
//         error: err.stack
//     });
// });

// //Assume 404 since no middleware responded
// app.use(function(req, res, next) {
//     res.status(404).render('404', {
//         url: req.originalUrl,
//         error: 'Not found'
//     });
// });

module.exports = app;
