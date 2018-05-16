// Initialization and Imports
var express 	=   require('express'),
	app 		=   express(),
	bodyParser 	=   require('body-parser'),
	mongoose 	=   require('mongoose'),
	passport 	= 	require('passport'),
	LocalStrategy = require('passport-local'),
	session		= 	require('express-session'),
	seedDB		= 	require('./seeds'),
	Campground  =   require('./models/campground'),
	Comment 	= 	require('./models/comment')
	User  		= 	require('./models/user');

// All required routes for app
var campgroundRoutes = require('./routes/campgrounds'),
	commentRoutes 	 = require('./routes/comments'),
	indexRoutes		 = require('./routes/index');


// App config
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
seedDB();


// Passport config
app.use(session({
	secret: "Yelp Camp secret key",
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
	next();
});


// Allows us to dry up our code by adding prefixes to our routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// Tells the server to listen at this port
app.listen(8080, function() {
	console.log("The YelpCamp server has started!");
});
