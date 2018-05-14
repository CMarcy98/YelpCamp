let mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
	title: String,
	author: String
});

module.exports = mongoose.model("Comment", commentSchema);
