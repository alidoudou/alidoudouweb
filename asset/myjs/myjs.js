// myjs.js
$(document).ready(function () {
	// start ready
	$("#prodbtn").click(function (event) {
		// 临时表录入
		var params = {
			brandname: $("#brandname").val(),
			productname: $("#productname").val(),
			productnum: $("#productnum").val(),
			number: $("#number").val(),
			price: $("#price").val()
		}
		
		if (params.brandname == '') {
			console.log('kongde');
		}

		$.ajax({
			type: "POST",
			data: params,
			url: '/prodinput',

		})
		.done(function (data) {
			// body...
			$("#product_items").empty();
			for (var i=0; i<data.products.length; i++){

				$("#product_items").append("<tr role=\"row\" class=\"odd\"><td>" + data.products[i].brandname + "</td><td class=\"sorting_1\">" + data.products[i].productname + "</td><td>" + data.products[i].productnum + "</td><td>" + data.products[i].number + "</td><td>" + data.products[i].price + "</td><td><a href=\"/modify/" + data.products[i]._id + "\">修改</a></td></tr>");
			}
			// console.log(data.products.length)
			$("#product_info").show();	

			//modal close
			$("#productModal").modal("hide");
			$("#brandname").val("");
			$("#productname").val("");
			$("#productnum").val("");
			$("#number").val("");
			$("#price").val("")

		})
	})


	$("#toprocessbtn").click(function (event) {
		//入库处理
		var params = {
			freight: $("#freight").val(),
			addinfo: $("#addinfo").val()
		}

		if (!$("#freight").val()) {
			alert("运费不能为空");
			exit();
		}

		$.ajax({
			type: "POST",
			data: params,
			url: '/toprocess'
		})
		.done(function (data) {
			// body...
			if (data == 'ok') {
				$("#toProcessModal").modal("hide");
				$("#freight").val("");
				$("#addinfo").val("");
				$(window.location).attr('href', 'http://localhost:3000/viewtransactionlist');
			}
		})
	})

});
