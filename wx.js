// routes.js
var express = require("express");
var wxRouter = express.Router();

var crypto = require("crypto");

var config = require("./config");

var MyArray = require("./functions").myArray;

var MyDate = require("./functions").myDate;

var fs = require("fs");

var http = require("http");

var UploadImages = require("./models/uploadImages");

var checkSignature = function (req, res, next) {
	var token="kangxtToken";
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var echostr = req.query.echostr;
	var nonce = req.query.nonce;
	//进行排序
	var oriArray = new Array();
	oriArray[0] = nonce;
	oriArray[1] = timestamp;
	oriArray[2] = token;
	oriArray.sort();
	var original = oriArray.join('');
	//加密
	var md5sum = crypto.createHash("sha1");
	md5sum.update(original);
	str = md5sum.digest("hex");
	
	if (str == signature) {
		res.end(echostr);
		console.log("Confirm and send echo back");
		next();
	} else {
		res.send("false");
		console.log("signature check failed")
	}
}


wxRouter.get("/wx/image", function (req, res, next) {
	// body...
	UploadImages.find(function (err, images) {
		// body...
		res.json(images);
	})
})


wxRouter.get("/wx", function(req, res, next){
	var token="kangxtToken";
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var echostr = req.query.echostr;
	var nonce = req.query.nonce;
	//进行排序
	var oriArray = new Array();
	oriArray[0] = nonce;
	oriArray[1] = timestamp;
	oriArray[2] = token;
	oriArray.sort();
	var original = oriArray.join('');
	//加密
	var md5sum = crypto.createHash("sha1");
	md5sum.update(original);
	str = md5sum.digest("hex");
	
	if (str == signature) {
		res.end(echostr);
		console.log("Confirm and send echo back");
	} else {
		res.send("false");
		console.log("signature check failed")
	}
})

wxRouter.post("/wx" ,function (req, res, next) {

	console.log(req.body.xml.msgtype[0] == "image")

	if (req.body.xml.msgtype[0] == "image") {
		//图片处理
		if (MyArray.prototype.contains.call(config.wechatAdmin, req.body.xml.fromusername[0])) {
			//管理员信息处理

			var today = MyDate.prototype.Format("yyyyMMdd")


			var url = req.body.xml.picurl[0];
			http.get(url, function (respone) {
				// body...
				var imgData = "";
				respone.setEncoding("binary");

				respone.on("data", function (chunk) {
					// body...
					imgData += chunk;
				})

				respone.on("end", function () {
					// body...

					require('crypto').randomBytes(16, function(ex, buf) {  
					    var token = buf.toString('hex');  
					    // console.log(token);  
					    var imagename = today + token;

					    fs.writeFile("asset/upload/images/" + imagename, imgData, "binary", function (err) {
							// body...
							if (err) {
								console.log(err);
							} else {

								var image = new UploadImages();
								image.imagename = imagename;
								image.fromusername = req.body.xml.fromusername;
								image.tousername = req.body.xml.tousername;
								image.save();

								console.log("donwn success");
								// res.end("ok");

								res.writeHead(200, {'Content-Type': 'application/xml'});

								var data = req.body.xml;
								var resMsg = '<xml>' +
								'<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
								'<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
								'<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
								'<MsgType><![CDATA[text]]></MsgType>' +
								'<Content><![CDATA[图片已接收]]></Content>' +
								'</xml>';
								console.log(resMsg);
								res.end(resMsg);

							}
							
						})

					});  
					
				})
			}) 
		} else {
				//非管理员提交图片
				res.writeHead(200, {'Content-Type': 'application/xml'});

				var data = req.body.xml;
				var resMsg = '<xml>' +
				'<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
				'<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
				'<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
				'<MsgType><![CDATA[text]]></MsgType>' +
				'<Content><![CDATA[发的图片是您需要的吗？]]></Content>' +
				'</xml>';
				console.log("reply user " + data.tousername );
				res.end(resMsg);
		}

	}

	



	// if (req.body.xml.content[0] == "图文") {
	// 	res.writeHead(200, {'Content-Type': 'application/xml'});
	// 	var data = req.body.xml;
	// 	var resMsg = '<xml>' +
	// 	'<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
	// 	'<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
	// 	'<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
	// 	'<MsgType><![CDATA[news]]></MsgType>' +
	// 	'<ArticleCount>2</ArticleCount>' +
	// 	'<Articles>' +
	// 	'<item>' +
	// 	'<Title><![CDATA[title1]]></Title>' +
	// 	'<Description><![CDATA[description1]]></Description>' +
	// 	'<PicUrl><![CDATA[picurl]]></PicUrl>' +
	// 	'<Url><![CDATA[alidoudou.club]]></Url>' +
	// 	'</item>' +
	// 	'<item>' +
	// 	'<Title><![CDATA[title]]></Title>' +
	// 	'<Description><![CDATA[description]]></Description>' +
	// 	'<PicUrl><![CDATA[picurl]]></PicUrl>' +
	// 	'<Url><![CDATA[url]]></Url>' +
	// 	'</item>' +
	// 	'</Articles>' +
	// 	'</xml>';
	// 	console.log(resMsg);
	// 	res.end(resMsg);
	// }

	// res.writeHead(200, {'Content-Type': 'application/xml'});

	// var data = req.body.xml;
	// var resMsg = '<xml>' +
	// '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
	// '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
	// '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
	// '<MsgType><![CDATA[text]]></MsgType>' +
	// '<Content><![CDATA[<a href="alidoudou.club">testlink</a>]]></Content>' +
	// '</xml>';
	// console.log(resMsg);
	// res.end(resMsg);
})


module.exports = wxRouter;
