var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Renders the root route
router.get("/", function(req, res) {
	res.render("landing");
});


// Register Form for new users
router.get('/register', (req, res) => {
	res.render('register');
});

// Register logic using passport functionality
router.post('/register', (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			req.flash("error", err.message);
			return res.redirect('/register');
		}

		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp " + user.username + "!");
			res.redirect('/campgrounds');
		});
	});
});

// Login form for existing users
router.get('/login', (req, res) => {
	res.render('login');
});

// Login logic
router.post('/login', passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}));

// Logout route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Sucessfully signed you out!");
	res.redirect("/campgrounds");
});

module.exports = router;