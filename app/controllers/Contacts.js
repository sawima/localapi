var _ = require('underscore'),
    mongoose = require('mongoose'),
    Contact = mongoose.model('Contact');

exports.contact = function(req,res,next,id) {
  Contact.load(id,function(err,contact) {
    if (err) return next(err);
        if (!contact) return next(new Error('Failed to load Contact ' + id));
        req.contact = contact;
        next();
  });
};

// exports.archive = function(req,res) {
// 	var contact = req.contact;

//   console.log(contact);

// 	contact=_.extend(contact,{status:'archived'});
//     contact.save(function(err) {
//       // res.json(contact);
//       res.redirect('/contacts_admin');
//     });
// };

exports.all = function(req,res) {
	Contact.find({},function(err,docs) {
      if(!err){
        // res.json(docs);
        res.render("admin/contact_admin",{contacts:docs});
      }
    });
};

exports.create = function(req,res) {
	var contact =  new Contact(req.body);
    contact.save(function(err) {
      if(!err){
        // res.json(contact);
        res.redirect('/thanks');
      }
    });
};

exports.archivethis = function(req,res) {
  var contact = req.contact;

  contact=_.extend(contact,{status:'archived'});
    contact.save(function(err) {
      // res.json(contact);
      res.redirect('/contacts_admin');
    });
};

exports.deletethis = function(req,res) {
  var contact = req.contact;


  contact.remove(function(err) {
    if (err) {
        res.render('error', {
            status: 500
        });
    } else {
      res.redirect('/contacts_admin');
    }
  });
};