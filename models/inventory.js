// inventory.js
var mongoose = require("mongoose");

// define Schema
var inventorySchema = mongoose.Schema({
	brandname: { type: String, required: true },
	productname: { type: String, required: true },
	number: { type: Number },
	price: { type: Number }
});

//get number of product
inventorySchema.methods.getProductNumber = function (brandname, productname, cb) {
	//console.log("jinlailou");

	// return Inventory.findOne({ brandname: brandname, productname: productname })
	// return 1000;

	// return this.result;
	Inventory.findOne({ brandname: brandname, productname: productname }, function (err, invenprod) {
		// body...

		console.log("brandname is " + brandname + " productname is " + productname);

		if ( invenprod ) {
			// return invenprod.number;
			cb(err, invenprod.number);
		} else {
			// return 0
			cb(err, 0)
		}
		
	});

	
}


var Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory