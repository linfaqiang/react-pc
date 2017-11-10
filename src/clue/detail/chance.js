import React from 'react'
import request from 'superagent';
import {
	hashHistory
} from 'react-router'

import CurrentPosition from '../../core/components/layout/CurrentPosition'
import Constants from '../../core/common/constants.js'
import {
	APIS
} from '../../core/common/config.js'

import AjaxRequest from '../../core/common/ajaxRequest.js';
import DictsFun from '../../core/common/dicts.js'

import Select from '../../core/components/Select.js'
import RegionSelect from '../../core/components/RegionSelect.js'
import Alert from '../../core/components/alert.js';
import { Modal, Button } from 'antd';
const confirm = Modal.confirm;


module.exports = React.createClass({

	getInitialState: function() {
		return {
			stageTypeList: [],
			stageList: [],
			info: {
				stageTypeId: 0,
				address: {},
				customer: {
					name: this.props.location.query.customerName,
					email: "",
					postCode: "",
					url: "",
					customerLevelId: "",
					industryId: "",
					ceoName: "",
					telephone: "",
					employeesTotal: "",
					shortname: "",
					annualIncome: "",
					remark: "",
					sourceId: "",
					fromEntityType: "CLUE",
					//fromEntityId: this.props.params.clueId,
					fromEntityId: this.props.params.id,
					addressId: this.props.location.query.addressId
				},
				chance: {
					chanceName: "",
					chanceSourceId: 0,
					description: this.props.location.query.needs,
					chanceStageId: 0,
					successRatio: 0,
					status: 0,
					forecastAmount: "",
					extimateDealDate: "",
					isColsed: 0,
					closeReason: "",
					dealAmount: "",
					dealDate: "",
					sourceId: "",
					fromEntityType: "CLUE",
					fromEntityId: this.props.params.id,
					// fromEntityId: this.props.params.clueId,
					stageTypeId: 0,
					chanceStageId: 0,
				},
				custLinkman: {}
			}

		}
	},

	componentDidMount: function(param) {
		var self = this;
		DictsFun.get(function() {
			self.setState({
				stageTypeList: Dicts.STAGE_TYPE_LIST
			});
		});

		$("#registrationForm").bootstrapValidator();
	},
	//根据商机类型获取阶段
	handleChangeStageType: function() {
		var typeId = this.refs.stageTypeId.value;
		var self = this;
		if (typeId) {
			AjaxRequest.get(APIS.dict_stage + "?stageTypeId=" + typeId, null, function(data) {
				if (data.code == 200 || data.code == '200') {
					let info = self.state.info;
					info.chance.stageTypeId = typeId;
					self.setState({
						stageList: data.data,
						info: info
					});

				}
			});
		}
	},

	handleChange: function(e) {
		let info = this.state.info;
		let name = e.target.name;

		if (name == "customerName") {
			info.customer.name = e.target.value
		} else {
			info.chance[name] = e.target.value;
		}
		this.setState({
			info: info,
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

		let id = this.props.location.query.clueId;
		let url = [CONFIG.APIS.clue, id, "to_chance"].join("/");
		if (id && id > 0) {
			info.id = id;
			AjaxRequest.post(url, info, function(data) {
				//outOfMaxCount：超出客户上限
				//hasRepeat=customerOther，已有客户。
				//shortnameOther，客户简称有重复
				if(data.data[0].hasRepeat == 'outOfMaxCount'){

					$('#modal-danger').modal().find('.modal-body').html('操作失败: 超出客户上限');

				}else if(data.data[0].hasRepeat == 'customerOther'){

					$('#modal-danger').modal().find('.modal-body').html('操作失败: <br />客户已存在&nbsp;&nbsp;<span style="color: red;">'+data.data[1].customerName+'</span>');

				}else if(data.data[0].hasRepeat == 'shortnameOther'){

					$('#modal-danger').modal().find('.modal-body').html('操作失败: 客户简称有重复');
				}else{
					$('#modal-success').modal();
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

		var stageTypeList = this.state.stageTypeList;
		var stageTypeOptions = stageTypeList.map(function(qst, key) {
			return <option key={key} value={qst.id}>{qst.text}</option>
		}.bind(this));

		var stageList = this.state.stageList;
		var stageOptions = stageList.map(function(qst, key) {
			return <option key={key} value={qst.id}>{qst.name}</option>
		}.bind(this));

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="dashboard-box my">
						<div className="box-tabbs">
							<div className="tabbable my" >
								<ul className="nav nav-tabs myTab noBorLR">
									<li className="active">
										<a>线索转商机</a>
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
														<label htmlFor="customerName">商机名称<sup>*</sup></label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.chance.chanceName}
																   onChange={this.handleChange}
																   name="chanceName" id="chanceName" placeholder="商机名称"
																   data-bv-notempty="true"
																   data-bv-notempty-message="商机名称必须输入"
																   data-bv-stringlength="true"
																   data-bv-stringlength-min="2"
																   data-bv-stringlength-max="500"
																   data-bv-stringlength-message="商机名称在6到500个字符之间"/>
														</div>
													</div>
												</div>

												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="stageTypeId">商机类型<sup>*</sup></label>
														<div className="input-icon icon-right">
															<select name="stageTypeId"
																	id="stageTypeId"
																	ref="stageTypeId"
																	style={{width:'100%'}}
																	onChange={this.handleChangeStageType}
																	data-bv-notempty="true"
																	data-bv-notempty-message="必须选择一项">
																<option value="">请选择</option>
																{stageTypeOptions}
															</select>
														</div>
													</div>
												</div>

											</div>
											<div className="row">
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="customerName">客户名称<sup>*</sup></label>
														<div className="input-icon icon-right">
															<input type="text" className="form-control"
																   value={this.state.info.customer.name}
																   onChange={this.handleChange}
																   name="customerName" id="customerName" placeholder="客户名称"
																   data-bv-notempty="true"
																   data-bv-notempty-message="客户名称必须输入"
																   data-bv-stringlength="true"
																   data-bv-stringlength-min="2"
																   data-bv-stringlength-max="500"
																   data-bv-stringlength-message="客户名称在6到500个字符之间"/>
														</div>
													</div>
												</div>
												<div className="col-sm-6">
													<div className="form-group">
														<label htmlFor="stageTypeId">商机阶段<sup>*</sup></label>
														<div className="input-icon icon-right">
															<select name="chanceStageId"
																	id="chanceStageId"
																	ref="chanceStageId"
																	style={{width:'100%'}}
																	onChange={this.handleChange}
																	data-bv-notempty="true"
																	data-bv-notempty-message="必须选择一项">
																<option value="">请选择</option>
																{stageOptions}
															</select>
														</div>
													</div>
												</div>

											</div>
											<div className="form-group">
												<label htmlFor="description">备注</label>
				                                        <span className="input-icon icon-right">
				                                            <textarea id="description" name="description" className="form-control" rows="4"
																	  value={this.state.info.chance.description}
																	  onChange={this.handleChange}
																	  placeholder="备注"></textarea>
				                                        </span>
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