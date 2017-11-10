/**
 * @file app请求
 * @author baddyzhou
 * @desc  所有的ajax请求请都调用此文件的方法
 */

var request = require('superagent');

function callbackDone(err, res, callback) {
	if (err || !res.ok) {
		console.log('请求失败');
	} else {
		if (res.body.code == '200') {
			callback(res.body);
		} else if (res.body.code == '406.3') {
			//localStorage.removeItem('loginInfo_crm');
			location.href = '#/login'

		} else if (res.body.status) {
			console.log('mxm登录成功');
			callback(res.body);
		} else if(res.body == true || res.body == 'true'){
			console.log('mxm操作成功');
			callback(res.body);
		} else if(res.body.code == "510.2"){
			callback(res.body);
		} else {
			//todo
			console.log('请求失败，原因：' + res.body.msg);
			toastr.error(res.body.msg);
			//toastr.warning('只能选择一行进行编辑');
			//toastr.info('info');
		}
	}


}

define(function(require, exports, module) {

	var AjaxRequest = {
		//get请求
		get: function(url, params, callback) {
			request
				.get(url)
				.query(params)
				.set("If-Modified-Since","0")
				.set("Cache-Control","no-cache")
				.set('Content-Type', 'application/json;charset=utf-8')
				.end(function(err, res) {
					callbackDone(err, res, callback)
				});
		},
		//post请求
		post: function(url, params, callback) {
			request
				.post(url)
				.send(params)
				.set('Content-Type', 'application/json;charset=utf-8')
				.end(function(err, res) {
					callbackDone(err, res, callback)
				});
		},
		//put请求
		put: function(url, params, callback) {
			request
				.put(url)
				.send(params)
				.set('Content-Type', 'application/json;charset=utf-8')
				.end(function(err, res) {
					callbackDone(err, res, callback)
				});
		},
		//delete请求
		delete: function(url, params, callback) {
			request
				.del(url)
				.query(params)
				.set('Content-Type', 'application/json;charset=utf-8')
				.end(function(err, res) {
					callbackDone(err, res, callback)
				});
		},
		post_form: function(url, params, callback) {
			request
				.post(url)
				.query(params)
				.set('Content-Type', 'x-www-form-urlencoded;charset=utf-8')
				.end(function(err, res) {
					callbackDone(err, res, callback)
				});
		},
	};
	module.exports = AjaxRequest;
});