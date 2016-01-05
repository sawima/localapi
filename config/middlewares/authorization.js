/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    var _ = require('underscore');
    var nonSecurePaths=['/signin','/forgot','/reset','/applyaccount'];
    // var re=new RegExp("^\/reset\/.");
    var re=new RegExp("^\/reset\/[a-zA-Z0-9]");
    
    if (!req.isAuthenticated()) {
        // return res.send(401, 'User is not authorized');
        // req.session.redirectUrl = req.url;
        if(_.contains(nonSecurePaths,req.path) || re.test(req.path))
            return next();
        return res.redirect('/signin?returnUrl='+req.url);
    }
    next();
};
/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

/**
 * Article authorizations routing middleware
 */
exports.article = {
    hasAuthorization: function(req, res, next) {
        if (req.article.user.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};