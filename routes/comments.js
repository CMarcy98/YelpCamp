var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// New Comment form
router.get("/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(!err) {
			res.render("comments/new", {campground: foundCampground});
		}
	})
});

// Create comment route
router.post("/", isLoggedIn, (req,res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(!err) {
			Comment.create(req.body.comment, (err, comment) => {
				if(!err) {
					// Automatically add username and user id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();

					foundCampground.comments.push(comment);
					foundCampground.save();
					console.log(comment);
					res.redirect("/campgrounds/"+ req.params.id);
				}
			});
		}
	})
});

// Checks to see if user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}

module.exports = router;