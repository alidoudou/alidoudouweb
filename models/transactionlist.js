// transactionlist.js 
var mongoose = require("mongoose"); 

// define Schema 
var transactionSchema = mongoose.Schema({ 
        brandname: { type: String, required: true }, 
        productname: { type: String, required: true }, 
        productnum: { type: String }, 
        additional: { type: String }, 
        number: { type: Number }, 
        price: { type: Number }, 
        counterparty: { type: String }, 
        date: { type: Date, default: Date.now() } 
}); 


var Transaction = mongoose.model("Transaction", transactionSchema); 

module.exports = Transaction 