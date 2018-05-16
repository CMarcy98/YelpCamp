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
			console.log(err);
			res.render('register');
		}

		passport.authenticate("local")(req, res, () => {
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
	res.redirect("/campgrounds");
});

// Checks to see if user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

module.exports = router;