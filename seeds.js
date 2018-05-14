let mongoose 	= require('mongoose'),
	Comment 	= require('./models/comment'),
	Campground 	= require('./models/campground');

let data = [
	{
		name: "Jungle Bay",
		image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__480.jpg",
		description: "This place is fulllll of bugs! It would eat you alive to go here and enjoy this place!"
	},
	{
		name: "Nightly Night",
		image: "https://cdn.pixabay.com/photo/2016/12/08/17/45/lake-sara-1892494__480.jpg",
		description: "One of the nicest places you've ever seen! This place lights up the night."
	},
	{
		name: "Clouds Rest",
		image: "https://cdn.pixabay.com/photo/2017/11/24/03/04/tent-2974050__480.jpg",
		description: "This is a great place to go camping! Plenty of clouds and trees."
	}
];

// Resets the database
function seedDB() {
	// Removes all campgrounds from the database
	Campground.remove({}, function(err) {
		if(!err) {
			console.log("Removed Campgrounds...");

			// Add a few campgrounds
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground) {
					if(!err) {
						console.log("Added a campground...");
						Comment.create({
							title: "This place is great, but I wish there was internet",
							author: "Christian Marcy"
						}, function(err, comment) {
							if(!err) {
								campground.comments.push(comment);
								campground.save();
								console.log("Added a new comment to the campground...");
							} else {
								console.log("Error in creating comment: ", err);
							}
						});
					} else {
						console.log("Error in for each loop: ", err);
					}
				});
			});
		} else {
			console.log("Error: ", err);
		}
	});
}

module.exports = seedDB;
