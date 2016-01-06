// var config=require('./config');

// var  mongoose = require('mongoose');
// // var Users = mongoose.model('User');
// var Requester = mongoose.model('Requester');

// var jwt=require('jsonwebtoken');
module.exports =  function(apirouter) {

  // router.route('/client').get(ClientsCtr.newClient).post(ClientsCtr.postNewClient);
  apirouter.route('/test').get(function(req,res) {
    res.send('hello kima');
  });

  apirouter.route('/users').get(function(req,res) {
    res.send('here is the users!');
  });

  // apirouter.route('/setup').get(function(req,res) {
  //   var nick = new Requester({ 
  //     name: 'james', 
  //     password: 'password',
  //     admin: true 
  //   });
  //   nick.save(function(err) {
  //     if (err) throw err;

  //     console.log('User saved successfully');
  //     res.json({ success: true });
  //   });
  // });

  // apirouter.route('/auth').get(function(req,res) {
  //   res.send(config.tokenSecret);
  // }).post(function(req,res) {
  //     // find the user
  //     console.log('get user and password from remote');
  //     // console.log(req.body.username);
  //     // console.log(req.body.password);
  //     Requester.findOne({
  //       name: req.body.username
  //     }, function(err, user) {

  //       if (err) throw err;

  //       // console.log(user);

  //       if (!user) {
  //         res.json({ success: false, message: 'Authentication failed. User not found.' });
  //       } else if (user) {

  //         // check if password matches
  //         //user.authenticate(password)
  //         if (user.password!==req.body.password) {
  //           res.json({ success: false, message: 'Authentication failed. Wrong password.' });
  //         } else {

  //           // if user is found and password is right
  //           // create a token
  //           var token = jwt.sign(user, config.tokenSecret, {
  //             expiresInMinutes: 1440 // expires in 24 hours
  //           });

  //           // return the information including token as JSON
  //           res.json({
  //             success: true,
  //             message: 'Enjoy your token!',
  //             token: token
  //           });
  //         }   

  //       }

  //     });
  //   });
}