//setuppassport.js
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");

module.exports = function (argument) {
	// body...
	passport.serializeUser(function (user, done) {
		// body...
		done(null, user._id);
	});

	passport.deserializeUser(function (id, done) {
		// body...
		User.findById(id, function (err, user) {
			// body...
			done(err, user);
		})
	});

	//local strategy 
	passport.use("login", new LocalStrategy(
		function (username, password, done) {
			// body...
			User.findOne({ username: username}, function (err, user) {
				// body...
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: "no user has that name " })
				}
				user.checkPassword(password, function (err, isMatch) {
					// body...
					if (err) { return done(err); }
					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, { message: "Invalid Password!"} );
					}

				});
			});
		}
	));
};














