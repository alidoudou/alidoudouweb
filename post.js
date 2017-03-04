// routes.js
var express = require("express");

var UploadImages = require("./models/uploadImages");


var postRouter = express.Router();


postRouter.get("/post", function (req, res, next) {
	// body...
	UploadImages.find(function (err, images) {
		// body...
		res.render("post", { images: images })
	})
	
})

postRouter.get("/rmimages", function (req, res, next) {
	// body...
	UploadImages.remove(function (err) {
		// body...
		res.json("del ok");
	});

})

postRouter.get("/post/view", function (req, res, next) {
	// body...
	UploadImages.find(function (err, images) {
		// body...
		res.json(images);
	})
})



module.exports = postRouter;
