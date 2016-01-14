module.exports =  function(router,passport,auth,permission) {

  router.all('*',auth.requiresLogin);

  //permission logic
  // router.use(/^\/(users|user|clients|client|roles|role|permits|permit|matrix)/,permission.userPermission);

  router.route('/').get(function(req,res) {
  	res.render('index');
  });

  router.route('/consume').get(function(req,res) {
    res.render('contents/consume')
  });


  var MembershipCtl=require('../app/controllers/Membership');
  router.route('/newmember').get(function(req,res) {
    res.render('contents/newmember')
  }).post(MembershipCtl.newMember);

  router.route('/deposit').get(function(req,res) {
    res.render('contents/deposit')
  });

  router.route('/query').get(function(req,res) {
    res.render('contents/query')
  });

  router.route('/coupons').get(function(req,res) {
    res.render('contents/coupons')
  });

  




  router.route('/applyaccount').get(function(req,res) {
    res.render('users/applyaccount');
  });

// ^\/reset\/[a-zA-Z0-9]
  // router.get("/^\/users/",permission.userPermission);
  // router.get('/users',permission.userPermission);
  //client operation
  var ClientsCtr=require('../app/controllers/Clients');
  router.param('clientId',ClientsCtr.client);
  router.get('/clients',ClientsCtr.all);
  router.route('/client').get(ClientsCtr.newClient).post(ClientsCtr.postNewClient);
  router.route('/client/:clientId').get(ClientsCtr.showClient).put(ClientsCtr.updateClient);


  //user management
  var Users = require('../app/controllers/Users');
  router.param('userId',Users.user);
  router.get('/users',Users.all);
  router.route('/user').get(Users.newUser).post(Users.create);
  router.route('/user/:userId').get(Users.show).put(Users.update);
  router.post('/user/disable/:userId',Users.update);

  //role and permission
  var Roles = require('../app/controllers/Roles');
  router.param('roleId',Roles.role);
  router.get('/roles',Roles.allRoles);
  router.route('/role').get(Roles.getUsersFromRole).post(Roles.newRole);
  router.route('/role/:roleId').post(Roles.removeRole);

    //role and permission
  var Permits = require('../app/controllers/Permits');
  router.param('permitId',Permits.permit);
  router.get('/permits',Permits.allPermits);
  router.route('/permit').post(Permits.newPermit);
  router.route('/permit/:permitId').post(Permits.removePermit);

  var Matrix = require('../app/controllers/Matrix');
  router.route('/matrix').get(Matrix.matrix).post(Matrix.saveMatrix);


  //products route
  router.get('/products',function(req,res) {
    res.render('products/products');
  })


  // router.get('/loginnojs',function(req,res) {
  //   res.render('users/loginformnojs');
  // });

  //test mail page
  // var mailCtrl=require('../app/controllers/Mails');
  // router.route('/sendmail').get(mailCtrl.mailform).post(mailCtrl.sendmail);

  router.route('/upload').get(function(req,res) {
    res.render('widgets/fileupload');
  });

  router.route('/summernote').get(function(req,res) {
    res.render('widgets/summernote');
  });

  var ContactCtr=require('../app/controllers/Contacts');
  router.param('contactid',ContactCtr.contact);

  router.route('/contact')
    .get(function(req,res) {
      res.render('pages/contact');
    })
    .post(ContactCtr.create);
  router.route('/contacts_admin').get(auth.requiresLogin,ContactCtr.all);
  router.get('/contacts/archive/:contactid',auth.requiresLogin,ContactCtr.archivethis);
  router.get('/contacts/delete/:contactid',auth.requiresLogin,ContactCtr.deletethis);

 
  //Setting the local strategy route
  // router.post('/users/session', passport.authenticate('local', {
  //       successRedirect:"/",
  //     failureRedirect: '/signin',
  //     failureFlash: true
  // }), Users.session);


  //authentication
  // router.get('/users/me', Users.me);
  // router.route('/users').post(Users.create).get(Users.all);
  // router.route('/users/:userId').get(Users.show).put(Users.update).delete(Users.destroy);

  router.route('/signin').get(Users.signin).post(Users.postSignin);
  router.get('/signup',Users.signup);
  router.get('/signout', Users.signout);

  router.route('/forgot').get(Users.forgot).post(Users.handleforgot);

  router.route('/reset/:token').get(Users.reset).post(Users.handlereset);  

  router.route('/changepwd').get(Users.changePwd).post(Users.updatePwd);
};
