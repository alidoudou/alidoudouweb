// app.js
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var setUpPassport = require("./setuppassport");
var xmlparser = require("express-xml-bodyparser");
var autoIncrement = require('mongoose-auto-increment');

var routes = require("./routes");
var wx = require("./wx");
var post = require("./post");
var app = express();


// temp begin
setUpPassport();
// temp end

var connection = mongoose.connect("mongodb://localhost:27017/myproject8");
// var connection = mongoose.createConnection("mongodb://localhost:27017/myproject8");

autoIncrement.initialize(connection);

app.set("port", process.env.PORT || 8080);


app.use(express.static(path.join(__dirname, 'asset')));
app.use('/modify', express.static(path.join(__dirname, 'asset')));
app.use('/translistmodify', express.static(path.join(__dirname, 'asset')));
app.use('/inventorymodify', express.static(path.join(__dirname, 'asset')));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xmlparser());
app.use(cookieParser());
app.use(session({
  secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
  cookie: {maxAge: 1000*60*60*24},
  resave: true,
  saveUninitialized: true
}));
// temp begin
app.use(passport.initialize());
app.use(passport.session());

// temp end
app.use(flash());
app.use(routes);
app.use(wx);
app.use(post);
app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});
