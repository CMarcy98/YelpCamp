let Comment 	= require('./models/comment'),
	Campground 	= require('./models/campground');

let data = [
	{
		name: "Jungle Bay",
		image: "https://cdn.pixabay.com/photo/2017/10/07/01/01/bach-leek-2825197__480.jpg",
		description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n" +
        "\n" +
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."
	},
	{
		name: "Nightly Night",
		image: "https://cdn.pixabay.com/photo/2016/12/08/17/45/lake-sara-1892494__480.jpg",
		description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n" +
        "\n" +
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."
	},
	{
		name: "Clouds Rest",
		image: "https://cdn.pixabay.com/photo/2017/11/24/03/04/tent-2974050__480.jpg",
		description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of \"de Finibus Bonorum et Malorum\" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32.\n" +
        "\n" +
        "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \"de Finibus Bonorum et Malorum\" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham."
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
