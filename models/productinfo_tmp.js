// productinfo_tmp.js
var mongoose = require("mongoose");


//定义数据库schema
var productinfo_tmpSchema = mongoose.Schema({
	brandname: { type: String, required: true },
	productname: { type: String, required: true },
	productnum: { type: String },
	number: { type: Number },
	price: { type: Number },
	createAt: { type: Date, default: Date.now() },
});




var Productinfo_tmp = mongoose.model("Productinfo_tmp", productinfo_tmpSchema);

module.exports = Productinfo_tmp;






