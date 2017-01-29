// app.js
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
// temp begin
var passport = require("passport");
// temp end
var flash = require("connect-flash");

// temp begin
var setUpPassport = require("./setuppassport");
// temp end

var routes = require("./routes");

var app = express();


// temp begin
setUpPassport();
// temp end

mongoose.connect("mongodb://localhost:27017/myproject8");

app.set("port", process.env.PORT || 3000);


app.use(express.static(path.join(__dirname, 'asset')));
app.use('/modify', express.static(path.join(__dirname, 'asset')));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
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
app.listen(app.get("port"), function() {
  console.log("Server started on port " + app.get("port"));
});