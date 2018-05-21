require('dotenv').config();
var mongoose = require('mongoose');

module.exports = function() {
	switch(process.env.MODE) {
		case 'PRODUCTION':
			console.log("Connected to the production database...");
			mongoose.connect(ess.env.DBURL);
			break;
		case 'DEVELOPMENT':
			console.log("Connected to the development database...");
			mongoose.connect("mongodb://localhost/yelp_camp");
			break;
		default:
			break;
	}
}