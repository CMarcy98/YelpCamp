var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

// Gets all campgrounds
router.get("/", function(req, res) {
	// Get all campgrounds from the DB
	Campground.find({}, function(err, campgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("./campgrounds/index", {campgrounds: campgrounds});
		}
	});

});

// Creates a new campground
router.post("/", isLoggedIn, function(req, res) {
	//Get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, image: image, description: description, author: author};


	// Save new campground to the DB
	Campground.create(newCampground, function(err) {
		if(err) {
			console.log(err);
		} else {
			//Redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});

});

// Gets new campground form page
router.get("/new", isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// Gets a campground given an Id
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
		if(error) {
			console.log("Error: ", error);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// Checks to see if user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
}

module.exports = router;