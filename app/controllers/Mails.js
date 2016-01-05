var nodemailer=require('nodemailer');
var mg=require('nodemailer-mailgun-transport');
var config=require('../../config/config');
var fs=require('fs');
var path = require('path');

exports.mailform=function(req,res) {
	res.render('contents/sendmail');
};

exports.sendmail=function(req,res) {
	var auth={
		auth:{
			api_key:config.mailgun.api_key,
			domain:config.mailgun.domain
		}
	}
	var transporter=nodemailer.createTransport(mg(auth));

	var headpath= path.normalize(__dirname+"/../../config/emailtemplates/new_order_first.html");
	var footpath= path.normalize(__dirname+"/../../config/emailtemplates/new_order_second.html");
	var new_order_email_head=fs.readFileSync(headpath,'utf8');
	var new_order_email_foot=fs.readFileSync(footpath,'utf8');

	var link_content='<a href="http://www.kimatech.com" class="btn-primary" itemprop="url">concatnate email body</a>';

	var new_order_email=new_order_email_head+link_content+new_order_email_foot;

	transporter.sendMail({
		from: 'order_admin@kimatech.com',
		  to: ['james2004hj@gmail.com','james@kimatech.com','jian.hong.ext@coriant.com'], // An array if you have multiple recipients.
		  subject: 'new order has been created',
		  //You can use "html:" to send HTML email content. It's magic!
		  // html: '<b>Wow Big powerful letters</b>',
		  html: new_order_email,

		  //You can use "text:" to send plain-text content. It's oldschool!
		  text: 'Mailgun rocks, pow pow!'
		}, function (err, info) {
		  if (err) {
		    console.log('Error: ' + err);
		  }
		  else {
		    console.log('Response: ' + JSON.stringify(info));
		  }
	});

	res.redirect('/');
};