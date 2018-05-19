// All middleware goes in here
var Campground = require('../models/campground');
var Comment = require('../models/comment');
middleware = {};


// Checks to see if current user is the owner of the campground
middleware.checkCampgroundOwnership = function(req, res, next) {
	// Checks to see if current user is the owner of the campground
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
			if(err) {
				res.redirect("back");
			} else {
				// Is the user authorized to edit the campground we found?
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
		// Otherwise redirect them
	} else {
		res.redirect("back");
	}
}

// Checks to see if current user is the owner of the comment
middleware.checkCommentOwnership = function(req, res, next) {
	// Is user logged in?
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err) {
				res.redirect("back");
			} else {
				// Is the user authorized to edit the comment?
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
		// Otherwise redirect them
	} else {
		res.redirect("back");
	}
}

// Check to see if user is logged in
middleware.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}


module.exports = middleware;