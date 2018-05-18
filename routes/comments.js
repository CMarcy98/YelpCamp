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


// Gets the edit form for an existing comment
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
		}
	});
});


// Updates an existing comment
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});


// Delete an existing comment
router.delete("/:comment_id", (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id)
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

// Checks to see if current user is the owner of the comment
function checkCommentOwnership(req, res, next) {
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



module.exports = router;