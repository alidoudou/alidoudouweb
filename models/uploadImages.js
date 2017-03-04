// uploadImages.js
var mongoose = require("mongoose");

// define Schema
var uploadImagesSchema = mongoose.Schema({
	imagename: { type: String, required: true },
	// url: { type: String, required: true },
	fromusername: { type: String },
	tousername: { type: String },
	date: { type: Date, default: Date.now()}
});



var uploadImages = mongoose.model("uploadImages", uploadImagesSchema);

module.exports = uploadImages