import React from 'react';
import AjaxRequest from '../core/common/ajaxRequest';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
		}
	},
	updatePassword:function () {
		var bootstrapValidator = $("#updatePswForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}

		var userInfo = UserInfo.get();
		var loginName = "";
		if(userInfo && userInfo.loginName){
			loginName = userInfo.loginName;
		}
		var fields = this.refs;
		var params = {};
		for (var attr in fields) {
			params[attr] = this.refs[attr].value;
		}
		var self = this;
		AjaxRequest.put(APIS.update_password.replace("{loginName}",loginName), params, function(data) {
			if (data.code == 200) {
				//检测原始密码对错，http://192.168.8.20:8080/mxm/system/user/check?password=123456
				AjaxRequest.get(APIS.crm_mxm + '/system/user/check?password='+self.refs['oldPassword'].value, null, function(data) {
					debugger;
					console.log("checkPsw=="+data);
					if(data == true || data == 'true'){
						//修改密码，http://192.168.8.20:8080/mxm/system/user/change-password
						AjaxRequest.post_form(APIS.crm_mxm + '/system/user/change-password', {password:self.refs['password'].value}, function(data) {
							debugger;
							console.log("changePsw=="+data);
							if(data == true || data == 'true'){
								$("#updatePasswordModal").modal("hide");
								localStorage.removeItem('loginInfo_crm');
								alert("密码修改成功，请重新登录!");
								window.location.href = '#login';
							}else{
								alert("mxm密码修改错误，请稍后再试！");
							}
						});

					}else{
						alert("mxm原始密码错误，请重新输入！");
					}

				});

			}
		})
	},

	clearValue:function () {
		var bootstrapValidator = $("#updatePswForm").data('bootstrapValidator');
		bootstrapValidator.resetForm();
		for (var attr in this.refs) {
			this.refs[attr].value = '';
		}
	},
	
	componentDidMount:function(){
		$("#updatePswForm").bootstrapValidator();
	},

	render:function(){
		/*
		* data-bv-different="true"
		 data-bv-different-field="oldPassword"
		 data-bv-different-message="新密码不能与旧密码一样"
		* */
		return (
			<div className="modal fade" id="updatePasswordModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-hidden="true">
								&times;
							</button>
							<h4 className="modal-title" id="myNoteModalLabel">修改密码</h4>
						</div>
						<div className="modal-body layer-public">
								<div className="widget-body">
									<form id="updatePswForm" method="post" className="form-horizontal bv-form"
										  data-bv-live="disabled"
										  data-bv-message="This value is not valid"
										  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
										  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
										  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">
												<div className="form-group">
													<label className="col-lg-3 control-label">原密码 <sup>*</sup></label>
													<div className="col-lg-9">
														<input type="password" className="form-control" name="oldPassword" ref="oldPassword"
															   data-bv-notempty="true"
															   data-bv-notempty-message="原密码不能为空"
															   placeholder="请输入原密码"
															   />
													</div>
												</div>

												<div className="form-group">
													<label className="col-lg-3 control-label">新密码 <sup>*</sup></label>
													<div className="col-lg-9">
														<input type="password" className="form-control" name="password" ref="password"
															   data-bv-notempty="true"
															   data-bv-notempty-message="新密码不能为空"
															   data-bv-stringlength="true"
															   data-bv-stringlength-min="6"
															   data-bv-stringlength-max="30"
															   data-bv-stringlength-message="密码长度不能小于6位"
															   placeholder="请输入新密码"
															   data-bv-different="true"
															   data-bv-different-field="oldPassword"
															   data-bv-different-message="新密码不能与旧密码一样"
															   data-bv-identical="true"
															   data-bv-identical-field="confirmPassword"
															   data-bv-identical-message="两次输入的密码不一致，请重新输入"
															   />
													</div>
												</div>

												<div className="form-group">
													<label className="col-lg-3 control-label">确认新密码 <sup>*</sup></label>
													<div className="col-lg-9">
														<input type="password" className="form-control" name="confirmPassword" ref="confirmPassword"
															   placeholder="请再次输入新密码"
															   data-bv-notempty="true"
															   data-bv-notempty-message="确认新密码不能为空"
															   data-bv-stringlength="true"
															   data-bv-stringlength-min="6"
															   data-bv-stringlength-max="30"
															   data-bv-stringlength-message="密码长度不能小于6位"
															   data-bv-identical="true"
															   data-bv-identical-field="password"
															   data-bv-identical-message="两次输入的密码不一致，请重新输入"
															/>
													</div>
												</div>
									</form>
								</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
							<button type="button" onClick={this.updatePassword} className="btn btn-danger">确定</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
});