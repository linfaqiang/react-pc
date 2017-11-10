import React from 'react';
import request from 'superagent';

import CurrentPosition from '../core/components/layout/CurrentPosition';
import Constants from '../core/common/constants.js';
import DictsFun from '../core/common/dicts.js'
import CONFIG from '../core/common/config.js'
import AjaxRequest from '../core/common/ajaxRequest.js';

import Select from '../core/components/Select.js'
import Alert from '../core/components/alert.js'
import ThreeLevel from '../core/components/ThreeLevel/threeLevel';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
var AreaComponents = React.createFactory(ThreeLevel);

module.exports = React.createClass({

	getInitialState: function() {
		return {
			changed: false,
			clueSourceList: [],
			customerList:[],
			isNewCustormer: true,
			prov: '',
			city: '',
			county: '',
			clueInfo: {
				id: 0,
				ownerStaffName: "",
				customerName: "",
				customerId: "",
				needs: "",
				remarkId: 0,
				remark: "",
				status: 5,
				sourceId: 0,
				source: "",
				fromEntityType: "",
				inputSource: 0,
				address: {
					id: 0,
					address: "",
					country: "中国",
					province: "",
					city: "",
					cityCode: "",
					adname: "",
					adcode: "",
					longitude: "",
					latitude: "",
					provinceId: "",
					cityId: ""
				},
				linkman: {
					id: 0,
					name: "",
					title: "",
					mobile: "",
					telephone: ""
				},
				customer:{customerName:'', customerId:''},
				showLoding: false
			}
		};

	},
	componentDidMount: function(param) {
		var self = this;
		DictsFun.get(function() {
			self.setState({
				clueSourceList: Dicts.CLUE_SOURCE_LIST
			});

			if(self.props.location.query.fromEntityType){
				var t = self.props.location.query.fromEntityType;

				switch(t){
					case 'MARKETING_ACTIVITY':
						self.refs.sourceId.setValue(2);
						break;
					default:
						break;
				}
			}
		});
		var id = self.props.params.id;
		if (id && id > 0) {
			var url = CONFIG.APIS.clue + "/" + id;
			AjaxRequest.get(url, null, function(body) {
				var data = body.data;
				// var data = JSON.parse(Base64.decode(body.data));
				var info = self.state.clueInfo;
				for (var key in info) {
					if (key == "address" || key == "linkman") {
						for (var k in info[key]) {
							info[key][k] = data[key][k];
						}
					} else {
						info[key] = data[key];
					}

				}

				self.refs.adcode.resetStates({
					prov: parseInt(info.address.provinceId),
					city: parseInt(info.address.cityId),
					county: parseInt(info.address.adcode)
				});
				self.setState({
					clueInfo: info,
					prov: info.address.provinceId,
					city: info.address.cityId,
					county: info.address.adcode
				});
				//todo:来源
				self.refs.sourceId.setValue(data.sourceId);
				if(info.customerId && info.customerId>0){
					self.setState({customer:{customerName:info.text, customerId:info.id}});
					self.setState({isNewCustormer: false});
				}
				self.getCustomerList();
			});
		}else{
			self.getCustomerList();
		}

		$("#registrationForm").bootstrapValidator();
	},
	getCustomerList: function(){
		var self = this;
		AjaxRequest.get(CONFIG.APIS.myCustomer_list, null, function(res) {
			if(res.data.length>0){
				self.setState({customerList: res.data});
			}else{
				self.setState({customerList: []});
			}
		});
	},

	//城市地址选择
	selectProvs: function(data) {
		console.log(JSON.stringify(data));
		this.setState({
			prov: data,
			city: '',
			county: ''
		})
	},
	selectCitys: function(data) {
		this.setState({
			city: data,
			county: ''
		})
	},
	selectCountys: function(data) {
		this.setState({
			county: data
		})
	},
	handleChange: function(e) {
		var newState = this.state.clueInfo;
		var name = e.target.name;
		if (name == "title" || name == "name" || name == "telephone" || name == "mobile") {
			newState.linkman[name] = e.target.value;
		} else if (name == "address") {
			newState.address.address = e.target.value;
		} else {
			newState[name] = e.target.value;
		}

		this.setState({
			clueInfo: newState,
			changed: true
		});
	},
	handleSave: function(e) {
		e.preventDefault();
		e.stopPropagation();
		var self = this;

		//校验数据
		var bootstrapValidator = $("#registrationForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}

		var info = this.state.clueInfo;
		info.sourceId = this.refs.sourceId.state.value;
		info.address.adcode = self.state.county;

		if(self.props.location.query.sourceId){
			info.fromEntityId = self.props.location.query.sourceId;
			info.fromEntityType = self.props.location.query.fromEntityType;
		}

		if(!self.state.isNewCustormer){
			info.customerId = self.state.customer.customerId;
			info.customerName = self.state.customer.customerName;
		}else{
			info.customerId = 0;
			//info.customerName = self.state.customer.customerName;
		}

		if(!info.linkman.mobile && !info.linkman.telephone){
			toastr.error('联系人手机和电话其中一项必填');
			return;
		}

		var id = self.props.params.id;
		if (id && id > 0) {
			AjaxRequest.put(CONFIG.APIS.clue + '/' + id, info, function(data) {
				// hasRepeat=linkman 代表线索联系人重复
				// hasRepeat=none 代表没有重复，检测通过

				if (data.code == "200") {
					$('#modal-success').modal();
				} else {
					if(data.data[0].hasRepeat == "linkman "){
						$('#modal-danger').modal().find('.modal-body').html('操作失败: '+data.msg);
					}else{
						$('#modal-danger').modal();
					}
				}
			});
		} else {
			AjaxRequest.post(CONFIG.APIS.clue, info, function(data) {
				if (data.code == "200") {
					$('#modal-success').modal();
				} else {

					if(data.data[0].hasRepeat == "linkman "){
						$('#modal-danger').modal().find('.modal-body').html('操作失败: '+data.msg);
					}else{
						$('#modal-danger').modal();
					}
				}
			});
		}
	},
	handleCancel: function() {
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
	changeChecked: function() {
		this.setState({
			isNewCustormer: !this.state.isNewCustormer
		})
	},
	handleCustomerChange: function(e){
		var data = e.params.data;
		this.setState({customer:{customerName:data.text, customerId:data.id}});
	},

	render: function() {
		var style_none = {
			display: "none"
		};
		var style100 = {
			width: "100%"
		};
		var style_button = {
			textAlign: 'left',
			padding: "10px 0 10px 0"
		};
		var hideSel = {
			width: '0px',
			height: '0px'
		};

		let id = this.props.params.id;
		let title = "新增线索";
		if (id > 0) title = "编辑线索";
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab noBorLR">
									<li className="active">
										<a>
											{this.props.route.name}
										</a>
									</li>
								</ul>

								<form id="registrationForm" method="post"
									  data-bv-live={navigator.userAgent.match('Trident') ? 'disabled' : 'enabled'}
									  data-bv-message="This value is not valid"
									  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
									  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
									  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">
									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>
										<div id="registration-form">
											<div className="row">
												<div className="col-sm-12">
													<div className="form-group">
														<label htmlFor="needs">需求描述<sup>*</sup></label>
														<div className="input-icon icon-right">
																	<textarea type="text" className="form-control"
																			  value={this.state.clueInfo.needs}
																			  onChange={this.handleChange} rows="4"
																			  name="needs" id="needs" placeholder="需求描述"
																			  data-bv-notempty="true"
																			  data-bv-notempty-message="需求描述必须输入"
																			  data-bv-stringlength="true"
																			  data-bv-stringlength-min="6"
																			  data-bv-stringlength-max="500"
																			  data-bv-stringlength-message="描述内容在6到500个字符之间"/>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="customerName">客户名称<sup>*</sup></label>
														<div className="input-icon icon-right">
															<div style={{paddingRight:'85px'}}>
																<input type="text" className="form-control"
																	   value={this.state.clueInfo.customerName}
																	   onChange={this.handleChange}
																	   name="customerName" id="customerName" placeholder="客户名称, 必填"
																	   data-bv-notempty="true"
																	   data-bv-notempty-message="客户名称必须输入"
																	   data-bv-stringlength="true"
																	   data-bv-stringlength-min="6"
																	   data-bv-stringlength-max="500"
																	   data-bv-stringlength-message="客户名称在6到500个字符之间"
																	   style={{display: this.state.isNewCustormer ? 'block' : 'none'}}
																/>
																<div style={{display: this.state.isNewCustormer ? 'none' : 'block'}}>
																	<Select2 ref="customerId"
																			 value={this.state.clueInfo.customerId}
																			 data={this.state.customerList}
																			 onSelect={this.handleCustomerChange}
																			 options={{placeholder: "选择已有客户，必选"}}
																			 style={{width:'100%'}}
																	/>
																</div>
															</div>

															<label style={{display:'inline-block', position:'absolute', right:'0px', top:'7px'}}>
																<input type="checkbox" className="colored-danger" checked={this.state.isNewCustormer ? true: false} />
																<span className="text"  onClick={this.changeChecked}>新客户</span>
															</label>
														</div>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="sourceId">线索来源<sup>*</sup></label>
														<div className="input-icon icon-right">
															<Select ref="sourceId"
																	value={this.state.clueInfo.sourceId}
																	list={this.state.clueSourceList}
																	name="sourceId" id="sourceId"
																	placeholder="线索来源"
															/>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-9">
													<div className="form-group">
														<label>公司地址</label>
														<div>
															{
																AreaComponents({
																	ref:'adcode',
																	data: __areaData__,
																	options: {
																		prov:this.state.prov || '',
																		city:this.state.city || '',
																		county:this.state.county || '',
																		defaultText:['省份','城市','区县']
																	},
																	notemptyThree:false,
																	selectProvs:this.selectProvs,
																	selectCitys:this.selectCitys,
																	selectCountys:this.selectCountys
																})
															}						                                        </div>
													</div>
												</div>
												<div className="col-sm-3">
													<div className="form-group">
														<label htmlFor="customerName">街道地址</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.clueInfo.address.address}
																   onChange={this.handleChange}
																   name="address" id="address" placeholder="街道地址"
																   data-bv-stringlength="false"
																   data-bv-stringlength-min="3"
																   data-bv-stringlength-max="200"
																   data-bv-stringlength-message="街道地址"/>
														</div>
													</div>
												</div>

											</div>
											<div className="form-group">
												<label htmlFor="remark">备注</label>
				                                        <span className="input-icon icon-right">
				                                            <textarea id="remark" name="remark" className="form-control" rows="4"
																	  value={this.state.clueInfo.remark}
																	  onChange={this.handleChange}
																	  placeholder="备注"
																	  data-bv-stringlength="false"
																	  data-bv-stringlength-min="6"
																	  data-bv-stringlength-max="500"
																	  data-bv-stringlength-message="客户名称在6到500个字符之间"></textarea>
				                                        </span>
											</div>
											<div className="form-title">
												联系人信息
											</div>
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="name">姓名<sup>*</sup></label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.clueInfo.linkman.name}
																   onChange={this.handleChange}
																   name="name" id="name" placeholder="联系人姓名"
																   data-bv-notempty="true"
																   data-bv-notempty-message="联系人姓名必须输入"
																   data-bv-stringlength="true"
																   data-bv-stringlength-min="2"
																   data-bv-stringlength-max="50"
																   data-bv-stringlength-message="客户名称在2到50个字符之间"/>
														</div>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="title">职位</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.clueInfo.linkman.title}
																   onChange={this.handleChange}
																   name="title" id="title" placeholder="联系人职位"
																   data-bv-stringlength="true"
																   data-bv-stringlength-min="2"
																   data-bv-stringlength-max="100"
																   data-bv-stringlength-message="客户名称在3到100个字符之间"/>
														</div>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="mobile">手机</label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.clueInfo.linkman.mobile}
																   onChange={this.handleChange}
																   name="mobile" id="mobile" placeholder="联系人手机和电话至少填一项"
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
																   value={this.state.clueInfo.linkman.telephone}
																   onChange={this.handleChange}
																   name="telephone" id="telephone" placeholder="联系人手机和电话至少填一项"
																   data-bv-regexp="true"
																   data-bv-regexp-regexp="^0\d{2,3}-?\d{7,8}$"
																   data-bv-regexp-message="请输入正确的电话号码"/>
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