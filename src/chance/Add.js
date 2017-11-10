import React, {Component} from 'react';
import UserInfo from '../core/common/UserInfo.js';
import {APIS} from '../core/common/config';
import Alert from '../core/components/alert.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';

module.exports = React.createClass({

	getInitialState: function() {
		return {
			chanceId:this.props.params.chanceId||'',
			stageList:[],
			customerList:[],
			stageTypeList:[],
			name:"",
			// reqParams:this.props.location.query,
			cid: this.props.params.customerId || '',
			status:null
		}
	},
	//根据商机类型获取阶段
	findStageByTypeId: function(stageId) {
		var typeId = this.refs.stageTypeId.value;
		var self = this;
		if (typeId) {
			AjaxRequest.get(APIS.dict_stage + "?stageTypeId=" + typeId, null, function(data) {
				if (data.code == 200 || data.code == '200') {
					self.setState({
						stageList:data.data
					});
					if(stageId != -1){
						self.refs.chanceStageId.value = stageId;
					}
				}
			});
		}
	},
	//获取所有客户
	getAllCustomer: function() {
		var self = this;
		AjaxRequest.get(APIS.myCustomer_list, null, function(data) {
			if (data.code == 200 || data.code == '200') {
				self.setState({
					customerList:data.data
				});

				//为了解决客户数据延迟加载的问题，所以获取商机详情放在这里
				var chanceId = self.state.chanceId;
				if (chanceId && chanceId > 0) {
					self.getDetail();
				}
				self.setReqParams();
			}
		});
	},
	//获取商机类型
	getDictStageType: function() {
		var self = this;
		AjaxRequest.get(APIS.chanceType, null, function(data) {
			if (data.code == 200 || data.code == '200') {
				self.setState({
					stageTypeList:data.data
				});
			}
		});
	},
	//提交表单
	submitForm: function() {
		var params = {
			"chanceSourceId": 0,
			"isColsed": 0,
			"closeReason": ""
		};
		var allRef = this.refs;
		var chanceId = this.state.chanceId;
		for(var attr in allRef){
			params[attr] = this.refs[attr].value;
		}
		//console.log(JSON.stringify(params));
		if(this.props.location.query.sourceId){
			params.sourceId = this.props.location.query.sourceId;
			params.fromEntityType = this.props.location.query.fromEntityType;
		}

		if(chanceId && chanceId > 0){//新建操作
			AjaxRequest.put(APIS.chance_add+"/"+chanceId, params, function(data) {
				/*if (data.code == 200) {
				 $('#modal-success').modal();
				 } else {
				 $('#modal-danger').modal();
				 }*/
				showAjaxCallbackModal(data);
			})
		}else{//编辑
			AjaxRequest.post(APIS.chance_add, params, function(data) {
				/*if (data.code == 200) {
				 $('#modal-success').modal();
				 } else {
				 $('#modal-danger').modal();
				 }*/
				showAjaxCallbackModal(data);
			})
		}
	},
	//表单验证
	formValidator: function() {
		var self = this;
		var liveFlag = navigator.userAgent.match('Trident') ? 'disabled' : 'enabled';
		$('#chanceForm').bootstrapValidator({
			live: liveFlag,
			message: 'This value is not valid',
			feedbackIcons: {
				valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
			},
			submitHandler: function(validator, form, submitButton) {
				self.submitForm();
			},
			fields: {
				chanceName: {
					validators: {
						notEmpty: {
							message: '商机名称不能为空'
						}
					}
				},
				customerId: {
					validators: {
						notEmpty: {
							message: '客户不能为空'
						}
					}
				},
				stageTypeId: {
					validators: {
						notEmpty: {
							message: '商机类型不能为空'
						}
					}
				},
				chanceStageId: {
					validators: {
						notEmpty: {
							message: '商机阶段不能为空'
						}
					}
				},
				status: {
					validators: {
						notEmpty: {
							message: '商机状态不能为空'
						}
					}
				},
				extimateDealDate: {
					validators: {
						date: {
							message: '请输入正确的日期格式',
							format: 'YYYY-MM-DD'
						}
					}
				},
				dealDate: {
					validators: {
						date: {
							message: '请输入正确的日期格式',
							format: 'YYYY-MM-DD'
						}
					}
				}
			}
		});
	},
	//获取详情
	getDetail: function() {
		var self = this;
		AjaxRequest.get(APIS.chance_detail + this.state.chanceId, null, function(data) {
			if (data.code == 200 || data.code == '200') {
				var thisRefs = self.refs,
					datas = data.data;
				for(var attr in thisRefs){
					if(attr == 'chanceStageId'){
						self.findStageByTypeId(datas[attr]);
					}else if(attr == 'status'){
						self.setState({
							status: datas[attr]
						});
						self.refs[attr].value = datas[attr];
					}else if(attr == 'extimateDealDate' || attr == 'dealDate' || attr == 'loseDate'){
						var date = datas[attr];
						if(date){
							date = date.split(" ")[0];
						}
						self.refs[attr].value = date;
					}else if(attr == "customerId"){
						$("#customerId").select2("val",datas[attr]);
					}else{
						self.refs[attr].value = datas[attr];
					}
				}
			}
		});
	},
	componentWillMount:function(){
		this.getAllCustomer();
		this.getDictStageType();
		var userInfo = UserInfo.get();
		if(userInfo && userInfo.name){
			this.setState({
				name: userInfo.name
			});
		}
	},
	setReqParams:function(){
		/*var reqParams = this.state.reqParams;
		if(reqParams){
			if(reqParams.type == 'customer'){
				$("#customerId").select2("val",reqParams.customerId);
			}
		}*/
		var cid = this.state.cid;
		if(cid){
			$("#customerId").select2("val", cid);
		}
	},

	//html元素全部加载之后执行
	componentDidMount: function() {
		$("#customerId").select2();
		$('.date-picker').datepicker({
			local:'ZH_CN'
		});
		this.formValidator();
	},

	cancel: function() {
		history.go(-1);
	},

	render: function() {
		var style_button = {
			textAlign: 'left',
			padding: "10px 0 10px 0"
		};
		var stageTypeList = this.state.stageTypeList;
		var stageTypeOptions = stageTypeList.map(function(qst,key){
			return <option key={key} value={qst.id}>{qst.name}</option>
		}.bind(this));

		var stageList = this.state.stageList;
		var stageOptions = stageList.map(function(qst,key){
			return <option key={key} value={qst.id}>{qst.name}</option>
		}.bind(this));

		var customerList = this.state.customerList;
		var customerOptions = customerList.map(function(qst,key){
			return <option key={key} value={qst.id}>{qst.text}</option>
		}.bind(this));

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
								<form id="chanceForm" method="post">
									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>

										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label>商机名称 <sup>*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control" ref="chanceName" name="chanceName" id="chanceName" placeholder="请输入商机名称" />
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label>责任人</label>
													<div className="input-icon icon-right">
														<input className="form-control" value={this.state.name} ref="createdName" name="createdName" id="createdName" readOnly="true" type="text"/>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-xs-12">
												<div className="form-group">
													<label>客户名称<sup>*</sup></label>
													<div className="input-icon icon-right">
														<select id="customerId" ref="customerId" name="customerId" style={{width:'100%'}}>
															<option value="">请选择</option>
															{customerOptions}
														</select>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label>商机类型 <sup>*</sup></label>
													<div className="input-icon icon-right">
														<select className="form-control" name="stageTypeId" id="stageTypeId" ref="stageTypeId" style={{width:'100%'}} onChange={this.findStageByTypeId.bind(this,-1)} disabled={this.state.chanceId>0 ? true : false}>
															<option value="">请选择</option>
															{stageTypeOptions}
														</select>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label>商机阶段 <sup>*</sup></label>
													<div className="input-icon icon-right">
														<select name="chanceStageId" id="chanceStageId" ref="chanceStageId" style={{width:'100%'}}>
															<option value="">请选择</option>
															{stageOptions}
														</select>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label>商机状态 <sup>*</sup></label>
													<div className="input-icon icon-right">
														<select name="status" id="status" ref="status" style={{width:'100%'}}>
															<option value="0">预备</option>
															<option value="1">进行中</option>
															<option value="2">暂挂</option>
															{/*<option value="3">赢单</option>
															 <option value="4">丢单</option>
															 <option value="5">取消</option>*/}
														</select>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label>成功率</label>
													<div className="input-icon icon-right">
														<select name="successRatio" id="successRatio" ref="successRatio" style={{width:'100%'}}>
															<option value="0">0%</option>
															<option value="5">5%</option>
															<option value="10">10%</option>
															<option value="15">15%</option>
															<option value="20">20%</option>
															<option value="25">25%</option>
															<option value="30">30%</option>
															<option value="35">35%</option>
															<option value="40">40%</option>
															<option value="45">45%</option>
															<option value="50">50%</option>
															<option value="55">55%</option>
															<option value="60">60%</option>
															<option value="65">65%</option>
															<option value="70">70%</option>
															<option value="75">75%</option>
															<option value="80">80%</option>
															<option value="85">85%</option>
															<option value="90">90%</option>
															<option value="95">95%</option>
															<option value="100">100%</option>
														</select>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label>预测金额</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control" name="forecastAmount" ref="forecastAmount" id="forecastAmount" placeholder="请输入预测金额" />
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label>预计成交日期</label>
													<div className="input-icon icon-right">
														<div className="input-group">
															<input className="form-control date-picker" name="extimateDealDate" ref="extimateDealDate" id="extimateDealDate" type="text" placeholder="请选择预计成交日期" data-date-format="yyyy-mm-dd" />
															<span className="input-group-addon">
																<i className="fa fa-calendar"></i>
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="row" style={{display:this.state.status == 3?'block':'none'}}>
											<div className="col-sm-6">
												<div className="form-group">
													<label>成交金额</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control" name="dealAmount" id="dealAmount" ref="dealAmount" placeholder="请输入成交金额" />
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label>成交日期</label>
													<div className="input-icon icon-right">
														<div className="input-group">
															<input className="form-control date-picker" name="dealDate" id="dealDate" ref="dealDate" type="text" placeholder="请选择成交日期" data-date-format="yyyy-mm-dd" />
															<span className="input-group-addon">
																<i className="fa fa-calendar"></i>
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="row" style={{display:this.state.status == 4?'block':'none'}}>
											<div className="col-sm-6">
												<div className="form-group">
													<label>输单金额</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control" name="loseAmount" id="loseAmount" ref="loseAmount" placeholder="请输入输单金额" />
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group" >
													<label>输单金额</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control" name="loseAmount" id="loseAmount" ref="loseAmount" placeholder="请输入输单金额" />
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-xs-12">
												<div className="form-group">
													<label>备注</label>
													<div className="input-icon icon-right">
														<textarea className="form-control" rows="3" id="description" ref="description" placeholder="请输入商机描述" name="description"></textarea>
													</div>
												</div>
											</div>
										</div>

										{/*<hr style={{marginLeft:'-20px', marginRight:'-20px'}}/>
										<div className="form-group">
											<div className="col-lg-9 col-lg-offset-3">
												<div className="buttons-preview" style={{textAlign:'left',paddingTop:10+'px'}}>
													<button onClick={this.cancel} className="btn btn-cancer">取消</button>
													<button type="submit" className="btn btn-danger">保存</button>
												</div>
											</div>
										</div>*/}
										<hr style={{marginTop: '20px', marginLeft:'-20px', marginRight:'-20px'}}  />
										<div className="widget-header noShadow" style={{padding:'20px 0px 20px 0px'}}>
											<div className="buttons-preview" style={style_button}>
												<button onClick={this.cancel} className="btn btn-cancer">取消</button>
												<button type="submit" className="btn btn-danger">保存</button>
											</div>
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