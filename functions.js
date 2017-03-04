var util = require("util");

function myArray() {}

myArray.prototype.contains = function ( needle ) {
  for (i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}


util.inherits(myArray, Array);

function myDate() {}

myDate.prototype.Format = function (fmt) { //author: meizz 

	var nowdate = new Date()

	var o = {
	    "M+": nowdate.getMonth() + 1, //月份 
	    "d+": nowdate.getDate(), //日 
	    "h+": nowdate.getHours(), //小时 
	    "m+": nowdate.getMinutes(), //分 
	    "s+": nowdate.getSeconds(), //秒 
	    "q+": Math.floor((nowdate.getMonth() + 3) / 3), //季度 
	    "S": nowdate.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (nowdate.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

util.inherits(myDate, Date);

module.exports = {
	myArray: myArray,
	myDate: myDate

}



