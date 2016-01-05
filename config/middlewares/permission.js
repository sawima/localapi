exports.orderPermission=function(req,res,next) {
	var user=req.user;

	if(!user.orderPermit()){
		return res.redirect('/');
	}
	next();
}

exports.userPermission=function(req,res,next) {
	var user=req.user;
	if(!user.userPermit()){
		return res.redirect('/');
	}
	next();
}

exports.productPermission=function(req,res,next) {
	var user=req.user;
	if(!user.productPermit()){
		return res.redirect('/');
	}
	next();
}
