// user.js
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

//bcrypt hash次数定义
var SALT_FACTOR = 10;

//定义空funtion为bcrypt模块使用
var noop = function () {
	// body...
}

//定义数据库schema
var userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	createAt: { type: Date, default: Date.now() },
	bio: String
});

//定义数据库保存数据时对数据转码的定义
userSchema.pre("save", function (done) {
	// body...
	var user = this;
	if (!user.isModified("password")) {
		return done();
	}
	bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
		// body...
		if (err) {
			return done(err);
		}
		bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
			// body...
			if (err) {
				return done(err);
			}
			//hash密码保存
			user.password = hashedPassword;
			done();
		})
	})
})

// 获取数据库名称的方法
userSchema.methods.name = function () {
	
	return this.username;
}

//校验密码
userSchema.methods.checkPassword = function (guess, done) {
	// body...
	bcrypt.compare(guess, this.password, function (err, isMatch) {
		// body...
		done(err, isMatch); 
	})
}

var User = mongoose.model("User", userSchema);

module.exports = User;






