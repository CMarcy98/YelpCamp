require('dotenv').config();
var mongoose = require('mongoose');

module.exports = function() {
	switch(process.env.MODE) {
		case 'PRODUCTION':
			console.log("Connected to the production database...");
			mongoose.connect("mongodb://" + process.env.DBUSER + ":" + process.env.DBPASSWORD + "@ds231090.mlab.com:31090/" + process.env.DBNAME);
			break;
		case 'DEVELOPMENT':
			console.log("Connected to the development database...");
			mongoose.connect("mongodb://localhost/yelp_camp");
			break;
		default:
			break;
	}
}