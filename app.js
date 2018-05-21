// Initialization and Imports
require('dotenv').config();
var express 	=   require('express'),
	app 		=   express(),
	bodyParser 	=   require('body-parser'),
	flash 		= 	require('connect-flash'),
	mongoose 	=   require('mongoose'),
	passport 	= 	require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override'),
	session		= 	require('express-session'),
	seedDB		= 	require('./seeds'),
	db 			= 	require('./db'),
	User  		= 	require('./models/user');

// All required routes for app
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes 	 = require('./routes/comments'),
	indexRoutes		 = require('./routes/index');


// App config
// // console.log(process.env.DATABASEURL);
// mongoose.connect("mongodb://localhost/yelp_camp");

db();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();


// Passport config
app.use(session({
	secret: process.env.SECRET_KEY,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Allows us to access current user from anywhere in code
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


// Allows us to dry up our code by adding prefixes to our routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// Tells the server to listen at this port
app.listen(8080 || process.env.PORT, process.env.IP, function() {
	console.log("The YelpCamp server has started!");
});
