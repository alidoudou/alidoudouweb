// routes.js
var express = require("express");
var passport = require("passport");

var User = require("./models/user");

var Productinfo = require("./models/productinfo_tmp")

var Inventory = require("./models/inventory");

var Transactionlist = require("./models/transactionlist");

var mylib = require("./lib/lib");

var router = express.Router();




//获取登录者ip
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

router.use(function (req, res, next) {
	// body...
	res.locals.currentUser = req.user;
	res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	console.log("登录者: " + getClientIp(req) + " 已登录服务器");
	next();
})

router.use("/inputbatch",mylib.checkRole);
router.use("/inputsalesman",mylib.checkRole);
router.use("/viewtransactionlist",mylib.checkRole);
router.use("/translistdelete",mylib.checkRole);
router.use("/inventorymodify",mylib.checkRole);
router.use("/inventorydelete",mylib.checkRole);
router.use("/inventory_update",mylib.checkRole);
router.use("/prodinput",mylib.checkRole);
router.use("/toprocess",mylib.checkRole);
router.use("/modify",mylib.checkRole);
router.use("/product_update",mylib.checkRole);
router.use("/viewproduct",mylib.checkRole);
router.use("/translistmodify",mylib.checkRole);
router.use("/translist_update",mylib.checkRole);


//inventory display page
router.get("/", function (req, res, next) {
	// body...
	 Inventory.find(function (err, result) { 
        // body... 
        res.render("inventory", { invs: result })
    }) 
})


//inventory date delete
router.post("/inventorydelete", function (req, res, next) {
	// body...
	var id = req.body.id;
	Inventory.remove({ _id: id }, function (error) {
		// body...
		if (error) {
			console.log("删除inventory时报错" + error);
		} else {
			console.log("删除");
			res.json("ok");
		}
	});

})


//modify inventory data
router.get("/inventorymodify/:id", function (req, res, next) {
	// body...
	Inventory.findOne({ _id: req.params.id }, function (err, result) {
		// body...
		//console.log(JSON.stringify(result));
		res.render("modifyinv", { inv: result });
	})
	
})

//update transactionlist information
router.post("/inventory_update", function (req, res, next) {
	// body...
	var brandname = req.body.brandname;
	var productname = req.body.productname;
	var number = req.body.number;
	var price = req.body.price;
	var id = req.body.id;

	var newinventory = {
		$set: {
			_id: id,
			brandname: brandname,
			productname: productname,
			number: number,
			price: price,
		}
	}

	Inventory.findOne({ _id: id }, function (err, oldinventory) {
		// body...
		Inventory.update(oldinventory, newinventory, function (err, result) {
			// body...
			console.log(err);
			next();
		})
	})

}, function (req, res, next) {
	// body...
	res.redirect("/");
})




//inputbath page
router.get("/inputbatch", function(req, res, next) {
	Productinfo.find(function (err, products) {
		// body...
		res.render("inputbatch",{products: products})
	})
});



//signup get method
router.get("/signup", function (req, res) {
	// body...
	res.render("signup");
})

//signup get post

router.post("/signup", function (req, res, next) {
	// body...
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;

	User.findOne({ username: username }, function (err, user) {
		// body...
		if (err) {
			return next(err);
		}
		if (user) {
			req.flash("error", "用户名已被注册");
			return res.redirect("signup");
		}

		User.findOne({ email: email }, function (err, user) {
			// body...
			if (err) {
				return next(err);
			}
			if (user) {
				req.flash("error", "Email 地址已被注册");
				return res.redirect("signup");
			}

			var newUser = new User({
				username: username,
				email: email,
				password: password	
			});
			newUser.save(next);
		})
	})
}, passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/signup",
	failureFlash: true
}))


//login get method
router.get("/login", function (req, res, next) {
	// body...
	res.render("login");
})

//login post method
router.post("/login", passport.authenticate("login", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
}));


//logout get method
router.get("/logout", function (req, res) {
	// body...
	req.logout();
	res.render("login");
})



//produnct input
router.post("/prodinput", function (req, res, next) {
	// body...
	var brandname = req.body.brandname;
	var productname = req.body.productname;
	var productnum = req.body.productnum;
	var number = req.body.number;
	var price = req.body.price;

	var newprodinfo = new Productinfo({
		brandname: brandname,
		productname: productname,
		productnum: productnum,
		number: number,
		price: price
	})

	newprodinfo.save(function (err) {
		// body...
		if (err) {
			console.log(err)
		} else {
			// res.json('ok');
			Productinfo.find(function (err, products) {
				// body...
				res.json({products: products})
			})
		}
	});
})

//inventory page 

router.post("/toprocess", function (req, res, next) { 
        // body... 
	    var freight = req.body.freight;
		var addinfo = req.body.addinfo;

        Productinfo.find().exec(function (err, products) { 
                //计算权值weighting 
                var pricesum = 0; 
        
                products.forEach(function (product) { 
                        // body... 
                        pricesum = pricesum + product.price * product.number
                }) 
                //权值 
                var weighting = (Number(pricesum) + Number(freight))/pricesum 
                
                console.log(Number(pricesum) + Number(freight)); 
                console.log(pricesum); 
                console.log("权值 " + weighting ); 
                
                products.forEach(function (product) { 
                        //对producttmp临时表的数据进行遍历 
                        var addTransction = new Transactionlist({ 
                                brandname: product.brandname, 
                                productname: product.productname, 
                                productnum: product.productnum, 
                                additional: "运费: " + freight + "; 权值: " + weighting + "; 备注: " + addinfo, 
                                number: product.number, 
                                price: product.price * weighting, 
                                counterparty: "wholesaler", 
                        }); 
                        addTransction.save(next); 
                        
                        Inventory.findOne({ brandname: product.brandname, productname: product.productname }, function (err, inven) { 
                                //根据brandname与productname关联库存inventory表中的记录进行处理 
                                if (inven) { 
                                        console.log("进入库存更新流程") 
                                        //表示库存表里存在符合的记录 
                                        inven.number = inven.number + product.number; 
                                        var currentPrice = product.price * weighting 
                                        //获得加权后的价格 
                                        if (currentPrice > inven.price) { 
                                                inven.price = currentPrice 
                                                inven.save(next); 
                                        } 
                                        inven.save(next); 
                                } else { 
                                        //新增库存记录 
                                        console.log("开始处理 " + product.productname); 
                                        var addInven = new Inventory({ 
                                                brandname: product.brandname, 
                                                productname: product.productname, 
                                                number: product.number, 
                                                price: product.price * weighting 
                                        });                                         
                                        addInven.save(next); 
                                        console.log("处理完毕 "+ product.productname)                              
                                }

                                Productinfo.remove(function (err) {
                                	// body...
                                	console.log("流程删除product临时表")
                                	next();
                                }) 
                        }); 
                }) 
        }) 
}, function (req, res, next) {
	// body...
	res.json('ok');
}) 

//modify product_tmp information
router.get("/modify/:id", function (req, res, next) {
	// body...
	Productinfo.findOne({ _id: req.params.id }, function (err, result) {
		// body...
		//console.log(JSON.stringify(result));
		res.render("modify", { prod: result });
	})
	
})

//update product_tmp information
router.post("/product_update", function (req, res, next) {
	// body...
	var brandname = req.body.brandname;
	var productname = req.body.productname;
	var productnum = req.body.productnum;
	var number = req.body.number;
	var price = req.body.price;
	var id = req.body.id;

	var newprod = {
		$set: {
			_id: id,
			brandname: brandname,
			productname: productname,
			productnum: productnum,
			number: number,
			price: price
		}
	}

	Productinfo.findOne({ _id: id }, function (err, oldprod) {
		// body...
		Productinfo.update(oldprod, newprod, function (err, result) {
			// body...
			next();
		})
	})

}, function (req, res, next) {
	// body...
	res.redirect("/");
})


//get inputsalesman

router.get("/inputsalesman", function (req, res, next) {
	// body...
	res.render("inputsalesman")
})

//post inputsalesman
router.post("/inputsalesman", function (req, res, next) {
	// body...
	var brandname = req.body.brandname;
	var productname = req.body.productname;
	var productnum = req.body.productnum;
	var number = req.body.number;
	var price = req.body.price;
	var additional = req.body.additional;

	Inventory.findOne({ brandname: brandname, productname: productname }, function (err, iven) {
		// body...
		if (iven) {
			//库存清单中存在同样商品
			if (iven.price < Number(price)) {
				console.log("jinruxiaoyu")
				iven.price = price;
				iven.number = iven.number + Number(number);
				iven.save(next);
			} else {
				iven.number = iven.number + Number(number);
				iven.save(next);
			}

			//交易明细表记录
			var addTransction = new Transactionlist({ 
				brandname: brandname, 
				productname: productname, 
				additional: additional,
				number: number, 
				price: price, 
				counterparty: "salesman", 
			}); 
			addTransction.save(next); 
		} else {
			//库存清单没有该商品
			var addInven = new Inventory({ 
				brandname: brandname, 
				productname: productname, 
				number: number, 
				price: price 
			});                                         
			addInven.save(next); 

			//交易明细表记录
			var addTransction = new Transactionlist({ 
				brandname: brandname, 
				productname: productname, 
				additional: additional,
				number: number, 
				price: price, 
				counterparty: "salesman", 
			}); 
			addTransction.save(next); 

		}
	})
}, function (req, res, next) {
	// body...
	res.redirect("/");
})

//get inventory information
router.get("/inventory", function (req, res, next) { 
    // body... 
    Inventory.find(function (err, result) { 
        // body... 
        res.render("inventory", { invs: result })
    }) 
}) 


//get wholesaler transaction information
router.get("/instockinfo", function (req, res, next) {
	// body...
	Transactionlist.find({ counterparty: "wholesaler" }, function (err, result) {
		// body...
		res.render("instockinfo", { transin: result } )
	});
})


router.get("/viewtransactionlist", function (req, res, next) { 
        Transactionlist.find(function (err, result) { 
        	res.render("transactionlist", { translist: result })
        }) 
}) 



router.get("/viewproduct", function (req, res, next) { 
    // body... 
    Productinfo.find(function (err, result) { 
        // body... 
        res.json(result);
    }) 
}) 

//translist date delete
router.post("/translistdelete", function (req, res, next) {
	// body...
	var id = req.body.id;
	Transactionlist.remove({ _id: id }, function (error) {
		// body...
		if (error) {
			console.log("删除translist时报错" + error);
		} else {
			console.log("删除");
			res.json("ok");
		}
	});

})

//modify transactionlist data
router.get("/translistmodify/:id", function (req, res, next) {
	// body...
	Transactionlist.findOne({ _id: req.params.id }, function (err, result) {
		// body...
		//console.log(JSON.stringify(result));
		res.render("modifytranslist", { translist: result });
	})
	
})

//update transactionlist information
router.post("/translist_update", function (req, res, next) {
	// body...
	var brandname = req.body.brandname;
	var productname = req.body.productname;
	var number = req.body.number;
	var price = req.body.price;
	var counterparty = req.body.counterparty;
	var additional = req.body.additional;
	var id = req.body.id;

	var newtranslist = {
		$set: {
			_id: id,
			brandname: brandname,
			productname: productname,
			number: number,
			price: price,
			counterparty: counterparty,
			additional: additional
		}
	}

	Transactionlist.findOne({ _id: id }, function (err, oldtranslist) {
		// body...
		console.log(JSON.stringify(oldtranslist));
		Transactionlist.update(oldtranslist, newtranslist, function (err, result) {
			// body...
			console.log(err);
			next();
		})
	})

}, function (req, res, next) {
	// body...
	res.redirect("/");
})



module.exports = router;