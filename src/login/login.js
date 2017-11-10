import React from 'react';
import AjaxRequest from '../core/common/ajaxRequest';
import {APIS} from '../core/common/config';

var crmCookie = {
	/*
	 描述：查找 cookie 取值
	 参数列表：
	 * @param {String} name：cookie 名称
	 * @return: {String}
	 */
	get: function(name) {
		var cookie = document.cookie,
			cookieName = encodeURIComponent(name) + '=',
			start = cookie.indexOf(cookieName),
			value = null;

		if (start > -1) {
			var cookieEnd = document.cookie.indexOf(';', start);
			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}
			value = decodeURIComponent(document.cookie.substring(start + cookieName.length, cookieEnd));
		}

		return value;
	},


	/*
	 描述：设置 cookie
	 参数列表：
	 * @param {String} name：名称
	 * @param {String} value：值
	 * @param {Date} expires： 过期时间
	 * @param {String} path：目录
	 * @param {String} domain：域
	 * @param {String} secure：安全标志
	 * @return: {无}
	 */
	set: function(name, value, expires, path, domain, secure) {
		var text = encodeURIComponent(name) + '=' + encodeURIComponent(value);

		if (expires instanceof Date) {
			text += ';expires=' + expires.toGMTString();
		}
		if (path) {
			text += ';path=' + path;
		}
		if (domain) {
			text += ';domain=' + domain;
		}
		if (secure) {
			text += ';secure';
		}
		document.cookie = text;
	},


	/*
	 描述：删除cookie ，通过设置时间为过去的时间使cookie失效从而达到目的
	 参数列表：
	 * @param {String} name：名称
	 * @param {String} path：目录
	 * @param {String} domain：域
	 * @param {String} secure：安全标志
	 * @return: {无}
	 */
	unset: function(name, path, domain, secure) {
		this.set(name, '', new Date(0), path, domain, secure);
	}
};
var checkLoginTimer = null;

module.exports = React.createClass({

	getInitialState: function() {
		return {
			checkRemember: false,
			showQrcodeLogin: false
		}
	},

	componentDidMount: function() {
		var userName = crmCookie.get('userName') || '';
		var password = crmCookie.get('password') || '';

		if (userName && password) {
			this.refs["username-crm"].value = userName;
			this.refs["password-crm"].value = password;
			this.setState({
				checkRemember:true
			});
		}
		//this.getQRCode();
	},
	loginIn: function() {
		var self = this;

		var username = this.refs['username-crm'].value,
			password = this.refs['password-crm'].value;

		if (!username) {
			alert('请输入账号!');
			return;
		}
		if (!password) {
			alert('请输入密码!');
			return;
		}

		var param = {
			user: username,
			username: username,
			password: password,
			remember: self.state.checkRemember
		};

		AjaxRequest.get(APIS.login, param, function(data) {
			if (data.code == 200) {
				//console.log(data.data);
				//alert('登录成功!');
				//localStorage.setItem('loginInfo_crm', JSON.stringify(data.data));

				if(window.localStorage){
					localStorage.setItem('loginInfo_crm', JSON.stringify(data.data));
				}else{
					crmCookie.set("loginInfo_crm", JSON.stringify(data.data));
				}
				if (self.state.checkRemember) {
					crmCookie.set("userName", username);
					crmCookie.set("password", password);
				} else {
					crmCookie.unset("userName");
					crmCookie.unset("password");
				}

				window.clearInterval(checkLoginTimer);
				//登录后台
				//http://demo.coracle.com:10019/mxm/api/login?user=WJ030&password=123456&remember=true
				AjaxRequest.post_form(APIS.crm_mxm + '/api/login', param, function(data) {
					window.location.href =  APIS.crm_pc;
				});
			} else {
				console.log('登录失败!')
			}
		});

	},
	changeChecked: function() {
		this.setState({
			checkRemember: !this.state.checkRemember
		})
	},
	handleKeyDown:function(e){
		var code = e.keyCode;
		if(code==13){
			this.loginIn();
		}
	},
	getQRCode: function(){
		var self = this;
		$.ajax({
			type: 'GET',
			url: APIS.qr_code,
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success: function(data){
				if(data.errorCode){
					toastr.error(data.errorMessage);
				}else{
					if(!data.image){
						toastr.error('二维码不存在');
					}else{
						window.clearInterval(checkLoginTimer);
						self.refs.qrcod.src = 'data:image/jpg;base64,'+data.image;
						self.waitForLogin(data.qrcodeNum.id);
					}
				}
			},
			error: function(data){
				console.log(JSON.stringify(data));
			}
		});
	},
	waitForLogin: function(id){
		if(!id) return;

		var self = this;
		var args = {};
		args.qrcodeNum = id;
		args = JSON.stringify(args);
		checkLoginTimer = window.setInterval(function(){
			$.ajax({
				type: 'POST',
				url: APIS.checkIsLogin,
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				data: args,
				success: function(data){
					if(data.status){
						self.vLogin(id);
					}
				},
				error: function(data){
					console.log(JSON.stringify(data));
				}
			});
		}, 3000);
	},//多频页面检查是否扫描过改二维码，然后模拟账号密码登录
	vLogin: function(id){
		var self = this;
		var param = {
			user: '',
			username: '',
			password: '',
			remember: self.state.checkRemember,
			qrCode: id
		};
		AjaxRequest.get(APIS.login, param, function(data) {
			if (data.code == 200) {
				window.clearInterval(checkLoginTimer);
				if(window.localStorage){
					localStorage.setItem('loginInfo_crm', JSON.stringify(data.data));
				}else{
					crmCookie.set("loginInfo_crm", JSON.stringify(data.data));
				}
				if (self.state.checkRemember) {
					crmCookie.set("userName", data.data.name);
					crmCookie.set("password", data.data.password);
				} else {
					crmCookie.unset("userName");
					crmCookie.unset("password");
				}
				window.location.href = '/crm-pc';
			} else {
				console.log('登录失败!')
			}
		});
	},
	showQrCode: function(){
		var flag = this.state.showQrcodeLogin;
		this.setState({showQrcodeLogin: !flag, checkRemember: false});

		if(!flag){
			this.getQRCode();
		}else{
			window.clearInterval(checkLoginTimer);
		}
	},

	render: function() {
		return (
			<div className="loginBg" onKeyDown={this.handleKeyDown}>
				<div className="login-container animated fadeInDown">
					<div className="loginbox bg-white login_logo">
						<div className="loginWay">
							<div className="way1" title="密码登录" onClick={this.showQrCode} style={{display: (this.state.showQrcodeLogin ? 'block' : 'none')}}></div>
							<div className="way2" title="扫码登录" onClick={this.showQrCode} style={{display: (this.state.showQrcodeLogin ? 'none' : 'block')}}></div>
						</div>
						<div className="qrCodeLogin" style={{display: (this.state.showQrcodeLogin ? 'block' : 'none')}}>
							<img ref="qrcod" className="qrCodeBox" />
						</div>
						<div  style={{display: (this.state.showQrcodeLogin ? 'none' : 'block')}}>
							<div className="loginbox-title"></div><br />

							<div className="loginbox-textbox">
								<input type="text" className="form-control login_pl user" ref="username-crm" />
							</div>
							<div className="loginbox-textbox">
								<input type="password" className="form-control login_pl passwd" ref="password-crm" />
							</div>
							<div className="checkbox" style={{padding: '0px 20px'}}>
								<label>
									<input type="checkbox" className="colored-danger" checked={this.state.checkRemember?true:false} />
									<span className="text"  onClick={this.changeChecked}>记住密码</span>
								</label>
							</div>
							<div className="loginbox-submit" style={{cursor:'pointer'}}>
								<input type="button" onClick={this.loginIn} ref="loginBtn" className="btn btn-danger btn-block" value="登录" />
							</div>
						</div>

					</div>
				</div>
			</div>
		)
	}
});