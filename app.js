// Initializes and starts the application
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


// Sets up the app
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




// -- Routes --

// Renders the root route
app.get("/", function(req, res) {
	res.render("landing");
});

// INDEX: Renders the campgrounds page
app.get("/campgrounds", function(req, res) {
	// Get all campgrounds from the DB
	Campground.find({}, function(err, campgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("./campgrounds/index", {campgrounds: campgrounds});
		}
	});

});

// CREATE: Posts a new campground
app.post("/campgrounds", function(req, res) {
	//Get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description};

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

// NEW: Page that renders a form to make a new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});

// SHOW: Shows a specific campground
app.get("/campgrounds/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
		if(error) {
			console.log("Error: ", error);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


// =======================
// 		COMMENT ROUTES
// =======================

app.get("/campgrounds/:id/comments/new", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(!err) {
			res.render("comments/new", {campground: foundCampground});
		}
	})
});

app.post("/campgrounds/:id/comments", (req,res) => {
	// lookup campground
	// create comment
	// connect new comment to campground
	// redirect back to show page of campground
	Campground.findById(req.params.id, (err, foundCampground) => {
		if(!err) {
			Comment.create(req.body.comment, (err, comment) => {
				if(!err) {
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/"+ req.params.id);
                }
			});
		}
	})
});


// =======================
// 		AUTH ROUTES
// =======================

// Register Form for new users
app.get('/register', (req, res) => {
	res.render('register');
});

// Register logic using passport functionality
app.post('/register', (req, res) => {
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
app.get('/login', (req, res) => {
	res.render('login');
});

// Login logic
app.post('/login', passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}));




// Tells the server to listen at this port
app.listen(8080, function() {
	console.log("The YelpCamp server has started!");
});
