import React from 'react';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import UserInfo from '../core/common/UserInfo.js';
import Tools from '../core/common/tools.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import ThreeLevel from '../core/components/ThreeLevel/threeLevel';
var AreaComponents = React.createFactory(ThreeLevel);
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import Alert from '../core/components/alert.js';
import { DatePicker } from 'antd';
const RangePicker = DatePicker.RangePicker;
import FileUpload from '../core/components/FileUpload/FileUpload';

module.exports = React.createClass({

	getInitialState:function(){
		var id = null;
		var tmp = this.props.params.taskId;
		if(parseInt(tmp)){
			id = parseInt(tmp);
		}
		return {
			routeId: id,
			staffList:[],
			customerList:[],
			linkmanList:[],
			chanceList:[],
			prov: '',        //三级联动
			city: '',
			county: '',
			customerId:null,
			customerLinkmanId:null,
			executorList:[],
			chanceId:null,
			reqParams:this.props.location.query,
			fileList:[],
			addressId:null,
			isRender:false,
			startTime:"",
			endTime:""
		}
	},

	findLinkmanOrChanceByCustomerId:function(id){
		var customerId = null;
		if(id && id != -1){
			customerId = id;
		}else{
			customerId = this.refs.customerId.el.val();
			if(!customerId){
				customerId = this.state.customerId;
			}
		}
		var self = this,
			linkmanUrl = APIS.customerDetail + customerId+ '/linkman';

		AjaxRequest.get(linkmanUrl, null, function(body) {
			if(body.code == 200 || body.code == '200'){
				var list = body.data;
				if(list && list.length > 0){
					for(var i=0;i<list.length;i++){
						list[i].text = list[i].name;
					}
				}
				self.setState({
					linkmanList:list
				});
			}
		});

		AjaxRequest.get(APIS.customerDetail + customerId + '/chances', null, function(body){
			if(body.code == 200 || body.code == '200'){
				var list = body.data;
				if(list && list.length > 0){
					for(var i=0;i<list.length;i++){
						list[i].text = list[i].chanceName;
					}
				}
				self.setState({
					chanceList:list
				});
			}
		});
	},
	setReqParams:function(){
		var self = this;
		var routes = this.props.routes;
		var type = routes[1].path;
		var pathname = this.props.location.pathname;//routes[routes.length - 1].path;
		var query = this.props.location.query;
		var params = this.props.params;
		if(type == 'customer'){
			self.setState({
				customerId: params.customerId
			});
		}else if(type == 'chance'){
			self.setState({
				customerId: query.customerId,
				chanceId: params.chanceId
			});
		}else if(type == 'linkman'){
			self.setState({
				customerId: query.customerId,
				customerLinkmanId: params.linkmanId
			});
		}
		if(pathname.match('stageTask')){
			self.refs['subject'].value = decodeURI(query.subject);
		}
		if(params.customerId || query.customerId){
			self.findLinkmanOrChanceByCustomerId(params.customerId || query.customerId);
		}

		if(query.from && query.from == "schedule"){
			var start = localStorage.getItem('CRM_AddSchedule_StartTime');
			var end = localStorage.getItem('CRM_AddSchedule_EndTime');
			this.setState({
				startTime:start+':00',
				endTime:end+':00'
			});
		}
	},
	/*setReqParams:function(){
		var reqParams = this.state.reqParams;
		var self = this;
		if(reqParams){
			var type = reqParams.type;
			if(type == 'customer'){
				self.setState({
					customerId: reqParams.customerId
				});
			}else if(type == 'chance'){
				self.setState({
					customerId: reqParams.customerId,
					chanceId:reqParams.chanceId
				});
			}else if(type == 'linkman'){
				self.setState({
					customerId: reqParams.customerId,
					customerLinkmanId:reqParams.linkmanId
				});
			}else if(type == 'stageTask'){
				self.refs['subject'].value = reqParams.subject;
			}
			if(type){
				self.findLinkmanOrChanceByCustomerId(reqParams.customerId);
			}

			if(reqParams.from && reqParams.from == "schedule"){
				var start = localStorage.getItem('CRM_AddSchedule_StartTime');
				var end = localStorage.getItem('CRM_AddSchedule_EndTime');
				this.setState({
					startTime:start+':00',
					endTime:end+':00'
				});
			}
		}
	},*/

	getCurrentDateTime:function(){
		var startDateTime = Tools.formatDate(new Date(), 'yyyy-mm-dd HH:nn');
		var endDateTime = Tools.formatDate(Tools.dateAdd('h',1,new Date()), 'yyyy-mm-dd HH:nn');
		this.setState({
			startTime:startDateTime+':00',
			endTime:endDateTime+':00'
		});

	},

	componentWillMount:function(){
		var self = this;

		AjaxRequest.get(APIS.staffs_all, null, function(body){
			if(body.code == 200 || body.code == '200'){
				self.setState({
					staffList:body.data
				})
			}
		});
		AjaxRequest.get(CONFIG.APIS.myCustomer_list, null, function(body) {
			if(body.code == 200 || body.code == '200'){
				self.setState({
					customerList: body.data
				});
			}
		});
		var userInfo = UserInfo.get();
		if(userInfo && userInfo.staffId){
			var list = this.state.executorList;
			list.push(userInfo.staffId);
			self.setState({
				executorList: list
			});
		}
	},

	componentDidMount:function(){
		var id = this.state.routeId;
		if (id && id > 0) {
			this.renderEdit();
		}else{
			this.getCurrentDateTime();
			this.setState({
				isRender:true
			});
		}
		$('.date-picker').datepicker({
			local:'ZH_CN'
		});
		$("#taskForm").bootstrapValidator();
		this.setReqParams();
	},
	//将数据渲染至对应的输入框
	renderEdit:function () {
		var self = this;
		AjaxRequest.get(APIS.task_list+'/'+this.state.routeId, null, function(body) {
			if (body.code == 200 || body.code == '200') {
				var thisRefs = self.refs;
				var datas = body.data;

				for(var attr in thisRefs){
					if(attr == 'adcode'){
						var path = datas["regionPath"];
						var subStr = path.split(",");
						if(subStr && subStr.length > 0){
							var province = subStr[0];
							var city = subStr[1];
							var county = 0;
							if(subStr.length > 2){
								county = subStr[2];
							}
							self.refs.adcode.resetStates({
								prov:province,
								city:city,
								county:county
							});
							self.setState({
								prov: province,        //三级联动
								city: city,
								county: county
							});
						}
					}else if(attr == 'customerId'){
						self.setState({
							customerId: datas[attr]
						})
					}else if(attr == 'customerLinkmanId'){
						self.findLinkmanOrChanceByCustomerId(-1);
						self.setState({
							customerLinkmanId: datas[attr]
						})
					}else if(attr == 'chanceId'){
						self.findLinkmanOrChanceByCustomerId(-1);
						self.setState({
							chanceId: datas[attr]
						})
					}else if(attr == 'adrDetail'){
						self.refs[attr].value = datas.addressVO && datas.addressVO.address
					}else if(attr == 'saleTeam'){
						var list = datas['executorList'];
						var ids = [];
						for(var i=0;i<list.length;i++){
							ids.push(list[i].id);
						}
						self.setState({
							executorList: ids
						})
					}else{
						self.refs[attr].value = datas[attr]
					}
				}
				self.setState({
					startTime: datas["startTime"],
					endTime: datas["endTime"]
				})

				var list = datas["fileList"];
				self.setFileList(list);
				self.setState({
					addressId:datas.addressId
				});

			}
		});
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
				}
				newFileList.push(fileNew);
			}
		}
		this.setState({
			fileList: newFileList,
			isRender:true
		});
	},
	//选择省份
	selectProvs: function (data) {
		this.setState({
			prov: data,
			city: '',
			county: ''
		})
	},
	//选择城市
	selectCitys: function(data){
		this.setState({
			city: data,
			county: ''
		})
	},
	//选择地区
	selectCountys: function(data){
		this.setState({
			county: data
		})
	},
	//取消
	cancelBtn:function () {
		history.go(-1);
	},

	//保存新建
	saveAdd:function () {
		var self = this;
		var bootstrapValidator = $("#taskForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}
		var param = {},
			allRef = this.refs,
			taskId = this.props.params.id;
		for(var attr in allRef){
			if(attr == 'adcode'){
				var address = {
					adcode:this.state.county,
					address:this.refs.adrDetail.value
				};
				param["addressVO"] = address;
			}else if(attr == 'saleTeam'){
				var saleTeam = [];
				var staffIds = this.refs[attr].el.val();
				for(var i=0;i<staffIds.length;i++){
					var isOwner = 0;
					if(i == 0){
						isOwner = 1;
					}
					var staff = {
						staffId:staffIds[i],
						isOwner:isOwner
					};
					saleTeam.push(staff);
				}
				if(saleTeam.length==0){
					$('#modal-info').modal();
					return false;
				}
				param[attr] = saleTeam;
			}else if(attr == 'customerId' || attr == 'customerLinkmanId' || attr == 'chanceId'){
				param[attr] = this.refs[attr].el.val();
			}else{
				param[attr] = this.refs[attr].value;
			}
		}
		param["addressId"] = this.state.addressId;
		var fileId = this.refs.fileUpload.getFileIdList();
		if(fileId && fileId.length > 0) {
			fileId = fileId.join(',');
			param["picFileIds"] = fileId;
		}
		param["startTime"] = this.state.startTime;
		param["endTime"] = this.state.endTime;
		//console.log(JSON.stringify(param));

		if(self.props.location.query.sourceId){
			param.sourceId = self.props.location.query.sourceId;
			param.fromEntityType = self.props.location.query.fromEntityType;
		}

		if(taskId > 0){//新建操作
			AjaxRequest.put(APIS.task_list+"/"+taskId, param, function(data) {
				if (data.code == 200) {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal();
				}
			})
		}else{//编辑
			AjaxRequest.post(APIS.task_list, param, function(data) {
				if (data.code == 200) {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal();
				}
			})
		}
	},
	getStartEndTime:function(value, dateString){
		this.setState({
			startTime:dateString[0]+':00',
			endTime:dateString[1]+':00'
		});
	},
	render:function(){
		var self = this;
		function renderChanceField(){
			if(CONFIG.Exclude && CONFIG.Exclude.chance) return null;
			return (
				<div className="row">
					<div className="col-sm-12">
						<div className="form-group">
							<label htmlFor="chanceId">商机</label>
							<div className="input-icon icon-right">
								<Select2
									ref="chanceId"
									multiple={false}
									style={{width:"100%"}}
									data={self.state.chanceList}
									value={self.state.chanceId}
									options={{placeholder: '选择商机'}}
								/>
							</div>
						</div>
					</div>
				</div>
			);
		}
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

								<form id="taskForm" method="post"
									  data-bv-live={navigator.userAgent.match('Trident') ? 'disabled' : 'enabled'}
									  data-bv-message="This value is not valid"
									  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
									  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
									  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">
									<div className="widget-body padding-20" style={{boxShadow: 'none'}}>
										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="subject">任务名称 <sup>*</sup></label>
													<div className="input-icon icon-right">
														<input type="text" name="subject" className="form-control" id="subject" ref="subject" placeholder="请输入任务名称"
															   data-bv-notempty="true"
															   data-bv-notempty-message="任务名称必须输入"
															   data-bv-stringlength="true"
															   data-bv-stringlength-min="6"
															   data-bv-stringlength-max="300"
															   data-bv-stringlength-message="任务名称在6到300个字符之间"/>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="subject">开始日期时间 - 结束日期时间 <sup>*</sup></label>
													<div className="input-icon icon-right">
														{this.state.isRender && <RangePicker showTime format="yyyy-MM-dd HH:mm" style={{width:'100%'}} size="large" onChange={this.getStartEndTime} defaultValue={[this.state.startTime,this.state.endTime]} />}
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="priorityLevel">优先级<sup>*</sup></label>
													<div className="input-icon icon-right">
														<select name="priorityLevel" ref="priorityLevel" data-bv-notempty="true"
																data-bv-notempty-message="优先级必须选择" id="priorityLevel" style={{width:'100%'}}>
															<option value="">请选择</option>
															<option value="0">一般</option>
															<option value="1">较急</option>
															<option value="2">紧急</option>
															<option value="3">非常紧急</option>
														</select>
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="saleTeam">执行人<sup>*</sup></label>
													<div className="input-icon icon-right">
														<Select2
															ref="saleTeam"
															multiple={true}
															style={{width:"100%"}}
															data={this.state.staffList}
															value={this.state.executorList}
															options={{placeholder: '选择执行人'}}
														/>
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="customerId">客户名称</label>
													<div className="input-icon icon-right">
														<Select2
															ref="customerId"
															multiple={false}
															style={{width:"100%"}}
															onSelect={this.findLinkmanOrChanceByCustomerId.bind(this,-1)}     //选择回调 ,如果是单选,只调用这个就行了
															data={this.state.customerList}
															value={this.state.customerId}
															options={{placeholder: '选择客户'}}
														/>
													</div>
												</div>
											</div>
											<div className="col-sm-6">
												<div className="form-group">
													<label htmlFor="customerLinkmanId">联系人</label>
													<div className="input-icon icon-right">
														<Select2
															ref="customerLinkmanId"
															multiple={false}
															style={{width:"100%"}}
															data={this.state.linkmanList}
															value={this.state.customerLinkmanId}
															options={{placeholder: '选择客户联系人'}}
														/>
													</div>
												</div>
											</div>
										</div>
										{renderChanceField()}
										{/*<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="chanceId">商机</label>
													<div className="input-icon icon-right">
														<Select2
															ref="chanceId"
															multiple={false}
															style={{width:"100%"}}
															data={this.state.chanceList}
															value={this.state.chanceId}
															options={{placeholder: '选择商机'}}
														/>
													</div>
												</div>
											</div>
										</div>*/}

										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label>地址</label>
													<div className="input-icon icon-right">
														{
															AreaComponents({
																ref:'adcode',
																data: __areaData__,
																options: {
																	prov:this.state.prov,
																	city:this.state.city,
																	county:this.state.county,
																	defaultText:['省份','城市','区县']
																},
																selectProvs:this.selectProvs,
																selectCitys:this.selectCitys,
																selectCountys:this.selectCountys
															})
														}
														<input className="form-control" name="adrDetail" placeholder="详细街道(具体地址)" ref="adrDetail" type="text" />
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="description">描述</label>
													<div className="input-icon icon-right">
																	<textarea id="description" name="description" ref="description" className="form-control" rows="3"
																			  placeholder="任务描述"
																			  data-bv-stringlength="false"
																			  data-bv-stringlength-min="6"
																			  data-bv-stringlength-max="500"
																			  data-bv-stringlength-message="任务描述在6到500个字符之间"></textarea>
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-sm-12">
												<div className="form-group">
													<label htmlFor="description">附件</label>
													<div className="input-icon icon-right">
														{this.state.isRender && <FileUpload
															ref="fileUpload"
															lists={this.state.fileList}
														/>}
													</div>
												</div>
											</div>
										</div>

										{/*<div className="form-group">
											<div className="buttons-preview" style={{textAlign:'left',paddingTop:10+'px'}}>
												<button onClick={this.cancelBtn} className="btn btn-cancer">取消</button>
												<button id="save-btn" onClick={this.saveAdd} className="btn btn-danger">保存</button>
											</div>
										</div>*/}
									</div>

									<hr />
									<div className="widget-header noShadow padding-20">
										<div className="buttons-preview" style={{textAlign:'left',paddingTop:10+'px'}}>
											<button onClick={this.cancelBtn} className="btn btn-cancer">取消</button>
											<button id="save-btn" onClick={this.saveAdd} className="btn btn-danger">保存</button>
										</div>
									</div>

								</form>
							</div>
						</div>
					</div>

				</div>


				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>
				<Alert result="info"></Alert>
			</div>
		)
	}
});