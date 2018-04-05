// Initializes and starts the application
var express 	=   require('express'),
	app 		=   express(),
	bodyParser 	=   require('body-parser'),
	mongoose 	=   require('mongoose');


// Sets up the app
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Connect to database
mongoose.connect("mongodb://localhost/yelp_camp");


// Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

// Create Campground model
var Campground = mongoose.model("Campground", campgroundSchema);

var temp = {
		name: "Salmon Creek",
		image: "https://thumb7.shutterstock.com/display_pic_with_logo/2547541/581001244/stock-photo-blured-image-of-camping-and-tent-with-high-iso-grained-picture-under-the-pine-forest-in-sunset-at-581001244.jpg",
		description: "This creek is home to many salmon that run wild in the streams."
	};
Campground.create(temp, function(error, campground) {
	if(error) {
		console.log(error);
	} else {
		console.log("Newly created campground: ");
		console.log(campground);
	}
});


// Global Variables
// var campgrounds = [
// 	{name: "Deer Park", image: "https://cdn.pixabay.com/photo/2017/07/24/13/42/mountains-2534691_1280.jpg"},
// 	{name: "Granite Hill", image: "https://thumb7.shutterstock.com/display_pic_with_logo/1243663/694873687/stock-photo-tents-on-campsite-with-a-view-of-the-menai-strait-and-snowdonia-mountains-in-wales-uk-694873687.jpg"},
// 	{name: "Granite Hill", image: "https://thumb7.shutterstock.com/display_pic_with_logo/1243663/694873687/stock-photo-tents-on-campsite-with-a-view-of-the-menai-strait-and-snowdonia-mountains-in-wales-uk-694873687.jpg"},
// 	{name: "Granite Hill", image: "https://thumb7.shutterstock.com/display_pic_with_logo/1243663/694873687/stock-photo-tents-on-campsite-with-a-view-of-the-menai-strait-and-snowdonia-mountains-in-wales-uk-694873687.jpg"},
// 	{name: "Mountain's Goat Rest", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__480.jpg"},
// 	{name: "Mountain's Goat Rest", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__480.jpg"},
// 	{name: "Mountain's Goat Rest", image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__480.jpg"}
// ];



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
			res.render("index", {campgrounds: campgrounds});
		}
	});

});

// CREATE: Posts a new campground
app.post("/campgrounds", function(req, res) {
	//Get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};

	// Save new campground to the DB
	Campground.create(newCampground, function(err, newlyCreated) {
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
	res.render("new");
});

// SHOW: Shows a specific campground
app.get("/campgrounds/:id", function(req, res) {
	res.send("Show page");
});

// Tells the server to listen at this port
app.listen(8080, function() {
	console.log("The YelpCamp server has started!");
});
