import React from 'react';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import CONFIG from '../core/common/config.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import Alert from '../core/components/alert.js';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';


module.exports = React.createClass({

	getInitialState: function() {
		return {
			routeId: this.props.params.linkmanId,
			changed: false,
			customerList: [],
			linkman: {
				"id": 0,//编辑， 联系人id
				"name": "",//姓名
				"title": "",//职务
				"mobile": "",//手机
				"telephone": "",//电话
				"customerId": 0,//所属的客户id, 公司
				"department": "",//部门
				"birthday": "",//生日
				"qq": "",//
				"email": "",//
				"wechat": "",//
				"sortIndex": 1,//排序号
				"headPhotoId": 0//头像
			},
			//cid: this.props.location.query.customerId,
			cid: this.props.params.customerId,
			customer:{id:'', text:''}

		};

	},

	componentDidMount: function(param) {
		let self = this;

		let id = self.state.routeId;

		if (id && id > 0) {//编辑联系人
			self.getExistLinkman(id);
		}else{//创建联系人
			self.getAllCustomer();
		}

		self.initDatePicker();
		self.formValidator();
	},

	initDatePicker:function(){
		var self = this;
		var dpicker = $('.date-picker');
		dpicker.datepicker({
			format:'yyyy-mm-dd',
			viewMode:'days',
			minViewMode:'days',
			local:'ZH_CN'
		});
		dpicker.on('changeDate', function(ev){
			//var t = new Date(ev.date);
			self.state.linkman.birthday = new Date(ev.date).Format('yyyy-MM-dd');
			self.setState(self.state.linkman);
		});
	},
	
	getExistLinkman:function(id){
		let self = this;
		let url = CONFIG.APIS.customer_linkmen + "/" + id;
		AjaxRequest.get(url, null, function(body) {
			let info = self.state.linkman;
			for (let key in info) {
				info[key] = body.data[key];
			}

			self.setState({linkman: info});
			self.state.cid = body.data.customerId;

			//$("#birthday").val(info.birthday);

			self.getAllCustomer();
		});
	},//获取已存在的联系人数据

	//获取所有客户
	getAllCustomer: function() {
		var self = this;
		AjaxRequest.get(APIS.myCustomer_list, null, function(data) {
			if (data.code == 200 || data.code == '200') {
				self.setState({
					customerList:data.data
				});

				if(self.state.cid){
					self.handleCustomerChange(self.state.cid);
				}
			}
		});
	},
	handleCustomerChange(e) {
		var self = this;
		var id = parseInt((e.target ? e.target.value : e));
		var list = self.state.customerList;

		for(var i=0; i<list.length; i++){
			if(id === list[i].id){
				self.state.customer = list[i];
				self.state.linkman.customerId = id;
				self.setState(self.state.customer);
				break;
			}
		}
		this.setState({changed: true});
	},

	handleChange: function(e) {
		let newState = this.state.linkman;
		let name = e.target.name;

		newState[name] = e.target.value;
		this.setState({
			linkman: newState,
			changed: true
		});
		this.setState({changed: true});
	},
	handleSave: function(e) {
		let self = this;

		let info = this.state.linkman;

		if(!info.customerId){
			toastr.error('公司必填');
			$('#registrationForm').data('bootstrapValidator').resetForm();
			return;
		}

		let id = self.state.routeId;
		if (id && id > 0) {
			info.id = id;
			AjaxRequest.put(CONFIG.APIS.customer_linkmen + "/" + id, info, function(data) {
				showAjaxCallbackModal(data);
			});
		} else {
			AjaxRequest.post(CONFIG.APIS.contact_list, info, function(data) {
				showAjaxCallbackModal(data);
			});
		}
	},
	handleCancel: function() {
		if ($("#birthday").val() != this.state.linkman.birthday) {
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

	formValidator:function(){
		console.log('--->');
		var self = this,
			thisForm = $('#registrationForm');
		var liveFlag = navigator.userAgent.match('Trident') ? 'disabled' : 'enabled';
		thisForm.bootstrapValidator({
			live: liveFlag,
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			submitHandler: function (validator, thisForm, thisBtn) {
				self.handleSave();
			},
			fields: {
				name: {
					validators: {
						notEmpty: {
							message: '联系人姓名不能为空'
						}
					}
				},
				title: {
					validators: {
						notEmpty: {
							message: '联系人职位不能为空'
						}
					}
				},
				telephone:{
					validators: {
						regexp: {//匹配规则
							regexp: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
							message: '电话有误。请重新填写，格式如：0755-88888888'
						}

					}
				},
				/*birthday:{
					validators: {
						regexp: {
							regexp: /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
							message: "联系人生日格式应如：1996-07-21"
						}
					}
				},*/
				mobile:{
					validators: {
						notEmpty: {
							message: '联系人手机不能为空'
						},
						phone: {/* /^((\+?86)|(\(\+86\)))?1\d{10}$/  /^1(3|4|5|7|8)\d{9}$/  /^(0?86)?1[\d]{10}$/  */
							message: '联系人手机格式不对'
						}
					}
				},
				email:{
					trigger:"change",
					validators: {
						emailAddress: {
							message: '邮箱格式不对'
						}
					}
				}
			}
		});
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
									<li className="dropdown active">
										<a>
											{this.props.route.name}
										</a>
									</li>
								</ul>

								<form id="registrationForm" method="post">
									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="name">姓名<sup>*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.linkman.name}
															   onChange={this.handleChange}
															   name="name" ref="name" placeholder="姓名" />
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="title">职位<sup>*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.linkman.title}
															   onChange={this.handleChange}
															   name="title" ref="title" placeholder="职位" />
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="telephone">电话</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.linkman.telephone}
															   onChange={this.handleChange}
															   name="telephone" ref="telephone" placeholder="联系人电话" />
													</div>
												</div>

											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="mobile">手机<sup>*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.linkman.mobile}
															   onChange={this.handleChange}
															   name="mobile" ref="mobile" placeholder="联系人手机" />
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="customerId">公司<sup>*</sup></label>
													<Select2
														ref="customerId"
														multiple={false}
														style={{width:"100%"}}
														data={this.state.customerList}
														onSelect={this.handleCustomerChange}
														value={this.state.customer.id}
														options={{placeholder: this.state.customer.text||'选择公司'}}
													/>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="department">部门</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.linkman.department}
															   onChange={this.handleChange}
															   name="department" ref="department" placeholder="部门" />
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
																   value={this.state.linkman.birthday}
																   type="text" />
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
															   value={this.state.linkman.qq}
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
															   value={this.state.linkman.email}
															   onChange={this.handleChange}
															   name="email" id="email" placeholder="Email"/>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="wechat">微信</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   value={this.state.linkman.wechat}
															   onChange={this.handleChange}
															   name="wechat" id="wechat" placeholder="联系人微信"/>
													</div>
												</div>
											</div>
										</div>
									</div>

									<hr />
									<div className="widget-header noShadow padding-20">
										<div className="buttons-preview" style={style_button}>
											<input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
											<button id="btnSave" type="submit" className="btn btn-danger">保存</button>
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