import React from 'react';
import {APIS} from '../core/common/config';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import AjaxRequest from '../core/common/ajaxRequest.js';

import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import Alert from '../core/components/alert.js';

import ThreeLevel from '../core/components/ThreeLevel/threeLevel';
import FileUpload from '../core/components/FileUpload/FileUpload';
import { Modal, Button, DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;
var AreaComponents = React.createFactory(ThreeLevel);
module.exports = React.createClass({

	getInitialState: function() {
		var id = null;
		var tmp = this.props.params.id;
		if(parseInt(tmp)){
			id = parseInt(tmp);
		}
		return {
			routeId: id,
			isRender:false,
			fileList:[],
			activityChance:[],
			activityCustomer:[],
			activityLinkMan:[],
			startActivityType:[],
			customerIdLinkMan:"",
			paramChance:{
				customerId: "",
				endCreatedOn: "",
				isOwner: 0,
				orderType: 0,
				pageNo: 1,
				pageSize: 10,
				q: "",
				staffList: [],
				stageList: [],
				startCreatedOn: "",
				statusList: []
			},
			param:{
				q: "",
				isSelf: 0,
				pageNo: 1,
				pageSize: 10
			},
			params:{
				address: {
					address:"",
					province:"",
					city:"",
					adname:"",
					adcode:"",
					longitude:"",
					latitude:""
				},
				audioFileIds: "",
				audioSubjectFileId: "",
				audioSubjectFileLength: "",
				chanceId: 0,
				content: "",
				costTypeId: "",
				costs: "",
				customerId: 0,
				customerLinkmanId: 0,
				endTime: "",
				picFileIds: "",
				startTime: "",
				subject: "",
				trackTypeId: ""
			},
			prov: '',        //三级联动
			city: '',
			county: '',
			provText: '',
			cityText: '',
			activityChanceVal:"",
			activityCustomerVal:"",
			activityLinkmanVal:"",
			endTime:"",
			startTime:"",
			activityName:"",
			customerFlag:false,
			chanceFlag:false
		};

	},

	componentDidMount: function() {
		var self=this;
		self.getCustomerData();
		//self.getChanceData();

		self.getAtivityType();

		$('.date-picker').datepicker({
			local:'ZH_CN'
		});
		$("#activityForm").bootstrapValidator();

		if(this.props.location.query){
			var reqParams = this.props.location.query;
			if(reqParams.from && reqParams.from == "schedule"){
				var start = localStorage.getItem('CRM_AddSchedule_StartTime');
				var end = localStorage.getItem('CRM_AddSchedule_EndTime');

				self.state.params.startTime = start+':00';
				self.state.params.endTime= end+':00';
				this.setState({
					startTime:start+':00',
					endTime:end+':00'
				});
			}
		}
		
	},
	setFileList:function(list){
		var newFileList = [];
		if(list && list.length > 0){
			for(var i=0;i<list.length;i++){
				var file = list[i];
				var fileNew = {
					uid: file.id,
					name: file.originName,
					status: 'done',
					url: file.fileUrl,
					size:file.fileSize,
					thumbUrl: file.fileUrl
				};
				newFileList.push(fileNew);
			}
		}
		this.setState({
			fileList: newFileList,
			isRender:true
		});
	},
	//城市地址选择
	selectProvs: function (data,text) {
		var self=this;
		self.setState({
			prov: data,
			city: '',
			county: '',
			provText:text
		});
	},
	selectCitys: function(data,text){
		var self=this;
		self.setState({
			city: data,
			county: '',
			cityText:text
		});
	},
	selectCountys: function(data,text){
		var self=this,
			provText=self.state.provText,
			cityText=self.state.cityText;
		self.setState({
			county: data
		});
		self.refs.detailAddress.value=provText+cityText+text;
	},
	//获取客户数据
	getCustomerData: function () {
		var self=this,
			param=self.state.param;
		//AjaxRequest.post(APIS.customer, param, function(body) {
		AjaxRequest.get(APIS.myCustomer_list, null, function(body) {
			if (body.code == 200 && body.data.length>0) {
				self.setState({
					activityCustomer:body.data
				});
				if(self.state.routeId){
					self.renderEdit();
				}else{
					self.setState({
						isRender:true
					});
				}
				if(!self.state.customerFlag){
					self.setOtherMsg(self.props.location.query);
					self.setState({
						customerFlag:true
					})
				}
			}else{
				alert('客户列表请求失败!')
			}
		});
	},
	//获取商机
	getChanceData: function () {
		var self=this,
			paramChance=self.state.paramChance;
		AjaxRequest.post(APIS.chance_list, paramChance, function(body) {
			if (body.code == '200' && body.data) {
				var newList = [];
				var list = body.data;
				if(list && list.length > 0){
					for(var i=0;i<list.length;i++){
						var obj = list[i];
						obj.text = obj.chanceName;
						newList.push(obj);
					}
				}
				self.setState({
					activityChance:newList
				});
				if(!self.state.customerFlag){
					self.setOtherMsg(self.props.location.query);
					self.setState({
						customerFlag:true
					})
				}
			}else{
				alert('商机列表请求失败!')
			}
		});
	},
	//判断跳转进来的模块
	setOtherMsg:function () {
		var self=this;
		var type = this.props.routes[1].path;
		var query = this.props.location.query;
		var params = this.props.params;

		if(type){
			switch(type){
				case 'customer':
					self.setState({
						activityCustomerVal:params.customerId
					});
					self.state.params.customerId=params.customerId;
					self.state.paramChance.customerId = params.customerId;
					self.setState(self.state.paramChance);
					self.setState({
						customerIdLinkMan:params.customerId
					});
					//self.getCustomerLinkMan();
					self.getChanceData();
					break;
				case 'chance':
					self.state.params.chanceId = params.chanceId;
					self.state.params.customerId= query.customerId;
					self.statusChanceAdd(params.chanceId);
					break;
				case 'linkman':
					self.setState({
						customerIdLinkMan:query.customerId
					});
					self.state.params.customerId=query.customerId;
					self.state.params.customerLinkmanId=params.linkmanId;
					//self.getCustomerLinkMan();
					self.setState({
						activityLinkmanVal:params.linkmanId
					});
					self.setState({
						activityCustomerVal:query.customerId
					});
					self.state.paramChance.customerId=query.customerId;
					self.setState(self.state.paramChance);
					self.getChanceData();
					break;
				default:
					break;
			}
		}
	},
	//判断是否是编辑
	renderEdit:function () {
		var self = this;
		AjaxRequest.get(APIS.activity_detail+self.props.params.id, null, function(body) {
			var thisRefs = self.refs,
				datas = body.data;
			self.state.workReportType=datas.reportType;
			for(var attr in thisRefs){
				if(attr=="activityChance"){
					self.setState({
						activityChanceVal:datas.chanceId
					})
				}else if(attr=="activityCustomer"){
					self.setState({
						activityCustomerVal:datas.customerId
					})
				}else if(attr=="activityLinkman" ){
					self.setState({
						customerIdLinkMan:datas.customerId
					});
					//self.getCustomerLinkMan();
					self.setState({
							activityLinkmanVal:datas.customerLinkmanId
					})
				}else if(attr=="activityShow" ){
					self.refs[attr].value= datas.content;
				}else if(attr=="activityType" ){
					self.refs[attr].value= datas.activityType;
				}else if(attr=="adcode" ){
					var addArr = datas.addressPath.split(',');
					self.refs.adcode.resetStates({
						prov: parseInt(addArr[0]),
						city: parseInt(addArr[1]),
						county: parseInt(addArr[2])
					});
					self.setState({
						prov: parseInt(addArr[0]),
						city: parseInt(addArr[1]),
						county: parseInt(addArr[2])
					});
				}else if(attr=="endTime" ){
					self.state.endTime= datas.endTime;
				}else if(attr=="startTime" ){
					self.state.startTime= datas.startTime;
				}else if(attr=="detailAddress" ){
					self.refs[attr].value= datas.address.address;
				}else if(attr=="activityName"){
					self.state.activityName= datas.subject;
				}
			}
			self.state.params.address.address=datas.address.address;
			self.state.params.chanceId=datas.chanceId;
			self.state.params.content=datas.content;
			self.state.params.customerId=datas.customerId;
			self.state.params.customerLinkmanId=datas.customerLinkmanId;
			self.state.params.trackTypeId=datas.activityType;
			self.state.params.endTime=datas.endTime;
			self.state.params.startTime=datas.startTime;
			self.state.params.subject=datas.subject;
			self.setState(self.state.params);
			self.setState(self.state.params);
			var list = datas["fileList"];
			self.setFileList(list);
			self.setTypeValue(2);
		});

	},
	//获取活动类型
	getAtivityType: function () {
		var self=this;
		AjaxRequest.get(APIS.data_wordbook + "DictTrackType", null, function(body) {
			if(body.code=='200'){
				self.setState({
					startActivityType:body.data
				})
			}

		});
	},
	//选择活动,商机,联系人时
	setTypeValue: function (flag) {
		var self = this;
		var val = self.refs.activityCustomer.el.val();

		if(flag>0){
			AjaxRequest.get(APIS.customerDetail + val+ '/linkman', null, function(body) {
				if(body.code == 200 || body.code == '200'){
					var list = body.data;
					if(list && list.length > 0){
						for(var i=0;i<list.length;i++){
							list[i].text = list[i].name;
						}
					}
					self.setState({
						activityLinkMan:list,
						activityLinkmanVal: (flag==2 ? self.state.params.customerLinkmanId : '')
					})
				}
			});
			AjaxRequest.get(APIS.customerDetail + val + '/chances', null, function(body){
				if(body.code == 200 || body.code == '200'){
					var list = body.data;
					if(list && list.length > 0){
						for(var i=0;i<list.length;i++){
							list[i].text = list[i].chanceName;
						}
					}
					self.setState({
						activityChance:list,
						activityChanceVal: (flag==2 ? self.state.params.chanceId : '')
					});
				}
			});
		}
	},
	statusChanceAdd: function (val) {
		var self=this;
		var thisList = self.state.activityChance,
			customerId = '';
		for(var i=0,len=thisList.length; i<len; i++){
			if(thisList[i].id == val){
				customerId = thisList[i].customerId
			}
		}
		self.setState({
			activityCustomerVal:customerId
		});
		self.setState({
			activityChanceVal:val
		});
		self.state.params.chanceId=val;
		self.setState(self.state.params);
		self.setState({
			customerIdLinkMan:customerId
		});
		//self.getCustomerLinkMan();
	},
	//获取主题
	handleChange: function(e) {
		var self=this;
		self.state.params.subject=e.target.value;
		self.setState({
			activityName:e.target.value
		})
	},
	//选择活动类型
	selectWorkRport: function (e) {
		var self=this,
			activityType=e.target.value;
		self.state.params.trackTypeId=activityType;
	},

	getStartEndTime:function(value, dateString){
		var self = this;

		self.state.params.startTime = dateString[0]+':00';
		self.state.params.endTime= dateString[1]+':00';
		self.setState({
			startTime: dateString[0]+':00',
			endTime: dateString[1]+':00'
		});
	},
	//获取内容
	activityContent: function (e) {
		var self=this,
			activityShow=e.target.value;
		self.state.params.content=activityShow;
	},
	//详细地址
	detailAddress: function (e) {
		var self=this;
		self.state.params.address.address=e.target.value;
	},
	//保存
	handleSave: function(e) {
		var self = this;
		var bootstrapValidator = $("#activityForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}
		if(!self.state.params.startTime || !self.state.params.endTime){
			toastr.error('请选择活动开始和结束时间');
			return;
		}
		self.state.params.address.adcode = self.state.county;
		self.state.params.address.address = self.refs.detailAddress.value;
		var fileId = this.refs.fileUpload.getFileIdList();
		if(fileId && fileId.length > 0) {
			fileId = fileId.join(',');
			self.state.params.picFileIds = fileId;
		}

		self.state.params.customerId = self.refs.activityCustomer.el.val()||0;
		self.state.params.customerLinkmanId = self.refs.activityLinkman.el.val()||0;
		self.state.params.chanceId = self.refs.activityChance.el.val()||0;

		self.setState(self.state.params);
		if(self.props.params.id != '0' && self.props.params.id != 'a'){
			AjaxRequest.put(APIS.activity_add+'/'+self.props.params.id, self.state.params, function(body){
				if(body.msg=='OK'){
					$('#modal-success').modal();
				}else {
					$('#modal-danger').modal();
				}
			});
		}else {
		AjaxRequest.post(APIS.activity_add, self.state.params, function(body){
			if(body.msg=='OK'){
				$('#modal-success').modal();
			}else {
				$('#modal-danger').modal();
			}
		});
		}
	},
	handleCancel: function() {
			history.go(-1);
	},
	render: function() {
		var style100 = {
			width: "100%"
		};
		var style_button = {
			textAlign: 'left',
			padding: "10px 0 10px 0"
		};
		var self=this;
		var lists=self.state.startActivityType;
		var ops = lists.map(function(qst,key){
			return<option key={key} value={qst.id}>{qst.name}</option>
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
								<form id="activityForm" method="post" data-bv-message="This value is not valid"
									  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
									  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
									  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">
									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>
										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="activityName">活动主题<sup className="mustRed">*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   ref="activityName"
															   onChange={this.handleChange}
															   value={this.state.activityName}
															   name="activityName" placeholder="请输入活动主题"
															   data-bv-notempty="true"
															   data-bv-notempty-message="活动主题必须输入"
															   data-bv-stringlength="true"
															   data-bv-stringlength-min="2"
															   data-bv-stringlength-max="500"
															   data-bv-stringlength-message="活动主题在2到500个字符之间"/>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="customerName">客户名称</label>
													<div className="input-icon icon-right">
														<Select2
															ref="activityCustomer"
															name="activityCustomer"
															multiple={false}
															style={{width:"100%"}}
															value={this.state.activityCustomerVal}
															onSelect={this.setTypeValue.bind(this, 1)}     //选择回调 ,如果是单选,只调用这个就行了
															data={this.state.activityCustomer}
															options={{placeholder: '选择客户'}}
														/>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="activityType">活动类型<sup className="mustRed">*</sup></label>
													<div className="input-icon icon-right">
														<select onChange={this.selectWorkRport}
																ref="activityType"
																className="form-control"
																name="activityType"
																placeholder="活动类型"
																data-bv-notempty="true"
																data-bv-notempty-message="必须选择一项">
															<option value="">--请选择--</option>
															{ops}
														</select>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="activityLinkman">联系人</label>
													<div className="input-icon icon-right">
														<Select2
															ref="activityLinkman"
															name="activityLinkman"
															value={this.state.activityLinkmanVal}
															multiple={false}
															style={{width:"100%"}}
															onSelect={this.setTypeValue.bind(this, 0)}     //选择回调 ,如果是单选,只调用这个就行了
															data={this.state.activityLinkMan}
															options={{placeholder: '选择联系人'}}
														/>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="typeChance">商机</label>
													<div className="input-icon icon-right">
														<Select2
															ref="activityChance"
															name="activityChance"
															value={this.state.activityChanceVal}
															multiple={false}
															style={{width:"100%"}}
															onSelect={this.setTypeValue.bind(this, 0)}     //选择回调 ,如果是单选,只调用这个就行了
															data={this.state.activityChance}
															options={{placeholder: '选择商机'}}
														/>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="subject">开始日期时间 - 结束日期时间 <sup>*</sup></label>
													<div className="input-icon icon-right">
														{/*<RangePicker showTime format="yyyy-MM-dd HH:mm" style={{width:'100%'}} size="large" onChange={this.getStartEndTime} defaultValue={[this.state.startTime,this.state.endTime]} />*/}

														<RangePicker ref="rangePicker" name="startEndTime" showTime format="yyyy-MM-dd HH:mm" style={{width:'100%'}} size="large" onChange={this.getStartEndTime} value={[this.state.startTime,this.state.endTime]}/>
													</div>
												</div>
											</div>
										</div>
										{/*<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="startTime">起始时间<sup className="mustRed">*</sup></label>
													<div className="input-icon icon-right">
														<DatePicker showTime
																	onChange={this.addStarTime}
																	value={this.state.starTime}
																	name="starTime"
																	ref="starTime"
																	format="yyyy-MM-dd HH:mm"
																	placeholder="请选择时间"
																	data-bv-notempty="true"
																	data-bv-notempty-message="请选择起始时间"/>
													</div>
												</div>

											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="endTime">结束时间<sup className="mustRed">*</sup></label>
													<div className="input-icon icon-right">
														<DatePicker showTime
																	onChange={this.addEndTime}
																	value={this.state.endTime}
																	name="endTime"
																	ref="endTime"
																	format="yyyy-MM-dd HH:mm"
																	placeholder="请选择时间"
																	data-bv-notempty="true"
																	data-bv-notempty-message="请选择结束时间"/>
													</div>
												</div>
											</div>
										</div>*/}
										<div className="row">
											<div className="col-sm-12">
												<div className="form-group activityAddress">
													<label>公司地址</label>
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
															//notemptyThree:true,
															selectProvs:this.selectProvs,
															selectCitys:this.selectCitys,
															selectCountys:this.selectCountys
														})
													}
												</div>
												<div className="form-group activityDetailAddress">
													<label htmlFor="detailAddress">详细地址</label>
													<div className="input-icon icon-right">
														<input type="text" className="form-control"
															   name="detailAddress" placeholder="请输入详细地址"
															   ref="detailAddress"
															   onChange={this.detailAddress}/>
													</div>
												</div>
											</div>
										</div>
										<div className="form-group">
											<label htmlFor="remark">活动内容</label>
				                                        <span className="input-icon icon-right">
				                                            <textarea ref="activityShow" id="remark" name="remark" className="form-control" rows="4"
																	  onChange={this.activityContent}
																	  placeholder="输入活动内容"/>
				                                        </span>
										</div>
										<div className="row">
											<div className="col-sm-12">
												<label htmlFor="description">附件</label>
												<div className="input-icon icon-right" id="fileDiv">
													{this.state.isRender && <FileUpload
														ref="fileUpload"
														lists={this.state.fileList}
													/>}
												</div>
											</div>
										</div>
										<hr style={{marginTop: '20px', marginLeft:'-20px', marginRight:'-20px'}} />
										<div className="widget-header noShadow" style={{padding:'20px 0px 20px 0px'}}>
											<div className="buttons-preview" style={style_button}>
												<input type="button" onClick={this.handleCancel} className="btn btn-cancer" value="取消" />
												<button id="btnSave" onClick={this.handleSave} className="btn btn-danger">保存</button>
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