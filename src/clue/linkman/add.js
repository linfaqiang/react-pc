import React from 'react'
import request from 'superagent';
import {
	hashHistory
} from 'react-router'

import CurrentPosition from '../../core/components/layout/CurrentPosition'
import Constants from '../../core/common/constants.js'
import CONFIG from '../../core/common/config.js'
import AjaxRequest from '../../core/common/ajaxRequest.js';

import Select from '../../core/components/Select.js'
import RegionSelect from '../../core/components/RegionSelect.js'
import Alert from '../../core/components/alert.js'

import store from './store'

module.exports = React.createClass({

	getInitialState: function() {
		return {
			//routeId: this.props.params.id,
			routeId: this.props.params.linkmanId,
			changed: false,
			info: {
				"id": 0,
				"name": "",
				"title": "",
				"mobile": "",
				"telephone": "",
				// "clueId": this.props.params.clueId,
				"clueId": this.props.params.id,
				"department": "",
				"birthday": "",
				"qq": "",
				"email": "",
				"wechat": "",
				"sortIndex": 1,
				"headPhotoId": 0
			}
		}

	},

	componentDidMount: function(param) {
		let self = this;
		let id = self.state.routeId;
		let url = [CONFIG.APIS.linkman, "clue", id].join("/");

		if (id && id > 0) {
			AjaxRequest.get(url, null, function(body) {
				let info = self.state.info;
				for (let key in info) {
					info[key] = body.data[key];
				}

				self.setState({
					info: info
				});

				$("#birthday").val(info.birthday);
			});
		};

		$('.date-picker').datepicker({
			local: 'ZH_CN'
		});

		$("#registrationForm").bootstrapValidator();
	},


	handleChange: function(e) {
		let newState = this.state.info;
		let name = e.target.name;

		newState[name] = e.target.value;
		this.setState({
			info: newState,
			changed: true
		});
	},
	handleSave: function(e) {
		let self = this;

		//校验数据
		var bootstrapValidator = $("#registrationForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}

		let info = this.state.info;
		info.birthday = $("#birthday").val();

		let id = self.props.params.linkmanId;
		// let clueId = self.props.params.clueId;
		let clueId = self.props.params.id;
		if (id && id > 0) {
			info.id = id;
			AjaxRequest.put(CONFIG.APIS.clue_linkmen + "/" + id, info, function(data) {
				if (data.code == "200") {
					$('#modal-success').modal();

				} else {
					$('#modal-danger').modal();
				}
			});
		} else {
			AjaxRequest.post(CONFIG.APIS.clue_linkmen, info, function(data) {
				if (data.code == "200") {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal();
				}
			});
		}
	},

	handleCancel: function() {
		var self = this;
		let clueId = self.props.params.id;
		// let clueId = self.props.params.clueId;

		if ($("#birthday").val() != this.state.info.birthday) {
			this.state.changed = true;
		}

		if (this.state.changed) {
			bootbox.confirm("表单已修改，你确定不保存退出吗?", function(result) {
				if (result) {
					history.go(-1);
				}
			});

		} else {
			history.go(-1);
		}

	},


	render: function() {
		let style_none = {
			display: "none"
		};
		let style100 = {
			width: "100%"
		};
		let style_button = {
			textAlign: 'left',
			padding: "10px 0 10px 0"
		};

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab noBorLR">
									<li className="active">
										<a>{this.props.route.name}</a>
									</li>
								</ul>
								<form id="registrationForm" method="post"
									  data-bv-message="This value is not valid"
									  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
									  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
									  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>
										<div id="registration-form">
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="name">姓名<sup>*</sup></label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.name}
																   onChange={this.handleChange}
																   name="name" id="name" placeholder="姓名"
																   data-bv-notempty="true"
																   data-bv-notempty-message="姓名必须输入"
																   data-bv-stringlength="true"
																   data-bv-stringlength-min="2"
																   data-bv-stringlength-max="50"
																   data-bv-stringlength-message="姓名在2到50个字符之间"/>
														</div>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="title">职位<sup>*</sup></label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.title}
																   onChange={this.handleChange}
																   name="title" id="title" placeholder="职位"
																   data-bv-notempty="true"
																   data-bv-notempty-message="职位必须输入"
																   data-bv-stringlength="true"
																   data-bv-stringlength-min="3"
																   data-bv-stringlength-max="100"
																   data-bv-stringlength-message="职位在3到100个字符之间"/>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="mobile">手机<sup>*</sup></label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.mobile}
																   onChange={this.handleChange}
																   name="mobile" id="mobile" placeholder="联系人手机"
																   data-bv-regexp="true"
																   data-bv-regexp-regexp="^(0?86)?1[\d]{10}$"
																   data-bv-regexp-message="请输入正确的手机号码"/>
														</div>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="telephone">电话</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.telephone}
																   onChange={this.handleChange}
																   name="telephone" id="telephone" placeholder="联系人电话"
																   data-bv-regexp="true"
																   data-bv-regexp-regexp="^0\d{2,3}-?\d{7,8}$"
																   data-bv-regexp-message="请输入正确的电话号码"/>
														</div>
													</div>

												</div>
											</div>

											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="department">部门</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.department}
																   onChange={this.handleChange}
																   name="department" id="department" placeholder="部门"
																   data-bv-stringlength="true"
																   data-bv-stringlength-min="3"
																   data-bv-stringlength-max="50"
																   data-bv-stringlength-message="部门在3到50个字符之间"/>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="birthday">生日</label>
														<div className="controls">
															<div className="input-group">
																<input className="form-control date-picker"
																	   name="birthday"
																	   id="birthday"
																	   placeholder="生日"
																	   onChange={this.handleChange}
																	   type="text"
																	   data-date-format="yyyy-mm-dd"
																	   data-bv-date="true"
																	   data-bv-date-format="YYYY-MM-DD"
																	   data-bv-date-message="生日格式:2016-10-01" />
					                                                	<span className="input-group-addon">
					                                                    	<i className="fa fa-calendar"></i>
					                                                	</span>
															</div>
														</div>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="qq">QQ</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.qq}
																   onChange={this.handleChange}
																   name="qq" id="qq" placeholder="QQ"/>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="email">Email</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.email}
																   onChange={this.handleChange}
																   name="email" id="email" placeholder="Email"
																   data-bv-emailAddress="true"
																   data-bv-emailAddress-message="请输入正确的Email号码"/>
														</div>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="wechat">微信</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.wechat}
																   onChange={this.handleChange}
																   name="wechat" id="wechat" placeholder="联系人微信"/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<hr />
									<div className="widget-header noShadow padding-20">
										<div className="buttons-preview" style={style_button}>
											<input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
											<button id="btnSave" onClick={this.handleSave} className="btn btn-danger">保存</button>

										</div>

									</div>
								</form>
				            </div>
						</div>
					</div>
				</div>
	
				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>
		
			</div>


		)
	}
});