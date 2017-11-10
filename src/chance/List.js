import React, { Component } from 'react';
import {Link} from 'react-router';
import TableView from '../core/components/TableList/TableView.js';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import TabSelect from '../core/components/PublicSelect/TabSelect.js';
import {APIS} from '../core/common/config';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition'
import Alert from '../core/components/alert.js';
import { Progress } from 'antd';

module.exports = React.createClass({
	getInitialState:function(){
		return {
			startUpload: false,
			percentage: 0,
			initParam:{
				"q":"",
				"orderType": 0,
				"isOwner": 0,
				"stageList": [],
				"statusList": [],
				"startCreatedOn":"",
				"endCreatedOn":"",
				"customerId": null,
				"customerName":"",
				"staffList": [],
				"pageNo":1,
				"pageSize":10,
				"selectType":0,
				"stageTypeId":null
			},    //搜索列表参数

			selectPP:{                //存放帅选框的数据
				chanceName: "",
				startCreatedOn: "",
				endCreatedOn: "",
				stageTypeId:null,
				stageList:[],
				statusList:[],
				staffList:[],
				customerId:null,
				customerName:"",
				dataType: [
					{ text: '所有类型', id: -1}
				],
				dataStage: [
					{ text: '所有阶段', id: -1}
				],
				dataStatus: [
					{ text: '预备', id: 0 },
					{ text: '进行中', id: 1 },
					{ text: '暂挂', id: 2 },
					{ text: '赢单', id: 3 },
					{ text: '丢单', id: 4 }
				],
				dataStaff: [

				]

			},
			selectShow:false,      //帅选框显示/隐藏
/*0：全部商机
 1：我关注的商机
 2：我的商机
 3：所有打开的商机
 4：已关闭的商机

 * */
			liList:[{
				name:'全部商机',
				index:0
			},/*{
				name:'我关注的商机',
				index:1
			},*/{
				name:'我的商机',
				index:2
			},{
				name:'所有打开的商机',
				index:3
			},{
				name:'已关闭的商机',
				index:4
			}],
			curentSelect:{         //当前帅选到的类型
				name:'全部商机',
				index:0
			},
			tableData:{               //存放表格数据
				tableName:'chance',
				url:APIS.chance_list,
				th:[
					{
						name:'商机',
						width:200
					},{
						name:'类型',
						width:150
					},{
						name:'阶段',
						width:150
					},{
						name:'状态',
						width:150
					},{
						name:'预计成交金额',
						width:150
					},{
						name:'客户',
						width:220
					},{
						name:'最后跟进时间',
						width:200
					},{
						name:'预计成交日期',
						width:200
					},{
						name:'责任人',
						width:150
					}
				],
				tr:['chanceName','stageTypeText','stageName', 'statusText', 'forecastAmount','customerName','trackDate','extimateDealDate','createdName']
			},

		}
	},
	setSelectType:function (index,text) {
		/*if(index ==1){
			console.error('我关注的商机未实现');
			alert('我关注的商机未实现');
			return null;
		}*/
		this.setState({
			curentSelect:{
				name:text,
				index:index
			}
		});
		this.initParams(index);
		this.initSelectValue();
		//这里执行帅选后的回调
		this.getData(this.state.initParam);
	},
	//初始化请求参数
	initParams:function(index){
		this.state.initParam = {
			"q":"",
			"orderType": 0,
			"isOwner": 0,
			"stageList": [],
			"statusList": [],
			"startCreatedOn":"",
			"endCreatedOn":"",
			"customerId": null,
			"customerName":"",
			"staffList": [],
			"pageNo":1,
			"pageSize":10,
			"selectType":index,
			"stageTypeId":null
		};
		this.setState(this.state.initParam);
	},
	//初始化筛选值
	initSelectValue:function(){
		this.state.selectPP.stageTypeId = null;
		this.state.selectPP.chanceName = null;
		this.refs.chanceName.value = null;
		this.state.selectPP.stageList = null;
		this.state.selectPP.statusList = null;
		this.state.selectPP.startCreatedOn = null;
		this.refs.createdOnStartAndEnd.value = null;
		this.state.selectPP.endCreatedOn = null;
		this.state.selectPP.customerId = null;
		this.state.selectPP.customerName = "";
		this.state.selectPP.staffList = null;
		this.setState(this.state.selectPP);
	},
	componentWillMount:function() {
		var self = this;
		AjaxRequest.get(APIS.chanceType, null, function(body){
			if (body.code == 200 || body.code == '200') {
				var newList = [{ text: '所有类型', id: -1}];
				var list = body.data;
				if(list && list.length > 0){
					for(var i=0;i<list.length;i++){
						var obj = list[i];
						obj.text = obj.name;
						newList.push(obj);
					}
				}
				self.state.selectPP.dataType = newList;
				self.setState(self.state.selectPP);
			}
		});
		AjaxRequest.get(APIS.staffs_subs, null, function(body){
			if (body.code == 200 || body.code == '200') {
				self.state.selectPP.dataStaff = body.data;
				self.setState(self.state.selectPP);
			}
		});

	},
	componentDidMount:function(){
		this.getData(this.state.initParam);
		$('#createdOnStartAndEnd').daterangepicker({format:"YYYY-MM-DD",opens:"left",separator:" / "});
	},
	setChanceValue: function(event) {
		this.state.selectPP.chanceName = event.target.value;
		this.setState(this.state.selectPP);
	},
	setTypeValue:function () {
		var type = this.refs.typeChance.el.val();
		if(type == -1){
			type = null;
		}
		this.state.selectPP.stageTypeId = type;
		this.setState(this.state.selectPP);

		if(type != null){
			var self = this;
			var url = APIS.dict_stage + "?stageTypeId=" + type;
			AjaxRequest.get(url, null, function(body){
				if (body.code == 200 || body.code == '200') {
					var newList = [];
					var list = body.data;
					if(list && list.length > 0){
						for(var i=0;i<list.length;i++){
							var obj = list[i];
							obj.text = obj.name;
							newList.push(obj);
						}
					}
					self.state.selectPP.dataStage = newList;
					self.setState(self.state.selectPP);
				}
			});
		}
	},
	setStageValue:function () {
		var stage = this.refs.chanceStage.el.val();
		if(stage == -1){
			stage = null;
		}
		this.state.selectPP.stageList = stage;
		this.setState(this.state.selectPP);
	},
	setStatusValue:function () {
		var status = this.refs.chanceStatus.el.val();
		if(status == -1){
			status = null;
		}
		this.state.selectPP.statusList = status;
		this.setState(this.state.selectPP);
	},
	setCustomerValue:function (event) {
		this.state.selectPP.customerName = event.target.value;
		this.setState(this.state.selectPP);
	},
	setStaffsValue:function () {
		this.state.selectPP.staffList = this.refs.staffs.el.val();
		this.setState(this.state.selectPP);
	},
	//商机名称输入框
	renderInputChance:function() {
		return (
			<div>
				商机<br/>
				<input type="text" className="form-control" ref="chanceName" placeholder="输入商机名称"  onChange={this.setChanceValue} />
			</div>
		);
	},
	//商机类型
	renderSelectType:function() {
		return (
			<div>
				类型<br/>
				<Select2
					ref="typeChance"
					multiple={false}
					style={{width:"100%"}}
					onSelect={this.setTypeValue}     //选择回调 ,如果是单选,只调用这个就行了
					data={this.state.selectPP.dataType}
					value={ this.state.selectPP.stageTypeId}
					options={{placeholder: '选择商机类型'}}
					/>
			</div>
		);
	},
	//商机阶段
	renderSelectStage:function() {
		return (
			<div>
				阶段<br/>
				<Select2
					ref="chanceStage"
					multiple={true}
					style={{width:"100%"}}
					onSelect={this.setStageValue}     //选择回调 ,如果是单选,只调用这个就行了
					onUnselect={this.setStageValue}  //删除回调
					data={this.state.selectPP.dataStage}
					value={ this.state.selectPP.stageList}
					options={{placeholder: '选择商机阶段'}}
					/>
			</div>
		);
	},
	//商机状态
	renderSelectStatus:function() {
		return (
			<div>
				状态<br/>
				<Select2
					ref="chanceStatus"
					multiple={true}
					style={{width:"100%"}}
					onSelect={this.setStatusValue}
					onUnselect={this.setStatusValue}  //删除回调
					data={this.state.selectPP.dataStatus}
					value={ this.state.selectPP.statusList }
					options={{placeholder: '选择商机状态' }}
					/>
			</div>
		);
	},
	//商机创建时间起止
	renderInputCreatedOnStartAndEnd:function() {
		return (
			<div>
				创建时间起止<br/>
				<div className="input-group">
					<input className="form-control date-picker" ref="createdOnStartAndEnd" placeholder="选择创建时间起止" id="createdOnStartAndEnd" type="text" readOnly="true" />
					<span className="input-group-addon">
						<i className="fa fa-calendar"></i>
					</span>
				</div>
			</div>
		);
	},
	//客户
	renderInputCustomer:function() {
		return (
			<div>
				客户名称<br/>
				<input type="text" className="form-control" ref="chanceCustomer" placeholder="输入客户名称" onChange={this.setCustomerValue} />
			</div>
		);
	},
	//指定人员
	renderSelectStaff:function() {
		return (
			<div>
				指定人员<br/>
				<Select2
					multiple={true}
					ref="staffs"
					style={{width:"100%"}}
					onSelect={this.setStaffsValue}
					onUnselect={this.setStaffsValue}  //删除回调
					data={this.state.selectPP.dataStaff}
					value={ this.state.selectPP.staffList}
					options={{placeholder: '选择指定人员'}}
					/>
			</div>
		);
	},
	confirmSelect:function () {      //保存后进行查询
		this.setState({selectShow:false});
		//点击确定时，获取创建时间起止的值
		var val = this.refs.createdOnStartAndEnd.value;
		if(val){
			var subStr = val.split("/");
			this.state.selectPP.startCreatedOn = subStr[0].trim();
			this.state.selectPP.endCreatedOn = subStr[1].trim();
			this.setState(this.state.selectPP);
		}

		this.state.initParam.q = this.state.selectPP.chanceName;
		this.state.initParam.stageTypeId = this.state.selectPP.stageTypeId;
		this.state.initParam.stageList = this.state.selectPP.stageList;
		this.state.initParam.statusList = this.state.selectPP.statusList;
		this.state.initParam.startCreatedOn = this.state.selectPP.startCreatedOn;
		this.state.initParam.endCreatedOn = this.state.selectPP.endCreatedOn;
		this.state.initParam.customerId = this.state.selectPP.customerId;
		this.state.initParam.customerName = this.state.selectPP.customerName;
		this.state.initParam.staffList = this.state.selectPP.staffList;

		this.setState(this.state.initParam);
		this.getData(this.state.initParam);
	},
	handlerResetFilter() {
		this.initSelectValue();
	},
	selectShowHide:function (e) {
		//e.preventDefault();
		this.setState({
			selectShow:!this.state.selectShow
		})
	},
	getData:function (param) {
		var self = this;
		self.refs.chanceList.beginLoad(param.pageNo);
		AjaxRequest.post(self.state.tableData.url+'?pageSize='+param.pageSize+'&pageNo='+param.pageNo, param, function(data) {
			if (data.code == 200 || data.code == '200') {
				self.refs.chanceList.setPagerData(data);
			}
		});
	},
	selectHandle: function() {
		this.refs.fileForm.reset();
		this.refs.filed.click();
	},
	handleFiles: function (e) {
		var fileList = e.target.files;
		var tmp = fileList[0].name.split('.')[1];
		if (!tmp.match(/xls|xlsx/i)) {
			toastr.error('只支持xls、xlsx格式文件');
			return null;
		}
		this.importData(fileList[0]);
	},
	importData:function(f){
		var self = this;
		var fd = new FormData();
		fd.append("file", f);
		var req = new XMLHttpRequest();
		req.open("POST", APIS.importChancesExcel, true);
		req.onload = function (oEvent) {
			var data = JSON.parse(req.response);
			self.setState({startUpload: false});

			if (req.status == 200) {
				if (data.code == 200) {
					$('#modal-success').modal();
				} else {
					$('#modal-danger').modal().find('.modal-body').html('<p  class="exportTipText">'+'操作失败: '+data.msg+'</p>');
				}
			} else {
				$('#modal-danger').modal().find('.modal-body').html('<p  class="exportTipText">'+'操作失败: '+req.statusText+'</p>');
			}
		};
		req.onprogress = function(e) {
			if (e.lengthComputable) {
				var percentage = Math.round((e.loaded * 100) / e.total);
				self.setState({percentage: percentage});
			}
		};
		req.send(fd);
		self.setState({startUpload: true});
	},//导入
	stopEvent: function(e){
		e.stopPropagation();
		e.preventDefault();
	},
	exportData:function(){
		window.open(APIS.exportChancesExcel);
	},//导出

	render:function(){
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper no-footer">
								<div style={{marginBottom:8 + 'px'}}>
									<TabSelect liList={this.state.liList} curentSelect={this.state.curentSelect} setSelectType={this.setSelectType}/>

									<div className="DTTT btn-group" style={{right:0+'px'}}>
										<a className="btn btn-default DTTT_button_copy" href="#/chance/add/0">
											<i className="fa fa-plus"></i>
											<span>创建 </span>
										</a>
										<a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
											<i className="fa fa-filter"></i>
											<span>筛选 <i className="fa fa-angle-down"></i></span>
										</a>
										<a className="btn btn-default DTTT_button_collection" onClick={this.selectHandle}>
											<i className="glyphicon glyphicon-save"></i>
											<span>导入</span>
											<form ref="fileForm" style={{display:'none'}}>
												<input ref="filed" type="file"
													   onChange={this.handleFiles}
													   style={{display:'none'}}/>
											</form>
										</a>
										<a className="btn btn-default DTTT_button_collection" onClick={this.exportData}>
											<i className="glyphicon glyphicon-open"></i>
											<span>导出</span>
										</a>
									</div>

									<div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:640+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
										<div className="well with-header" style={{background:'#fff',height:'100%'}}>
											<div className="header bordered-blue">
												<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
													<button onClick={this.handlerResetFilter} className="btn btn-cancer">重置</button>
													<button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
												</div>
											</div>
											<div style={{marginTop:30+'px',paddingLeft:10+'px'}}>
												{this.renderInputChance()}<br/>
												{this.renderSelectType()}<br/>
												{this.renderSelectStage()}<br/>
												{this.renderSelectStatus()}<br/>
												{this.renderInputCreatedOnStartAndEnd()}<br/>
												{this.renderInputCustomer()}<br/>
												{this.renderSelectStaff()}<br/>
											</div>
										</div>
									</div>

								</div>
								<TableView ref="chanceList" getData={this.getData} tableData={this.state.tableData} initParam={this.state.initParam}></TableView>

								{/*<List ref="chanceList" getData={this.getData} initParam={this.state.initParam}  tableData={this.state.tableData}/>*/}
							</div>
						</div>
					</div>
				</div>
				<div className="uploadProgress" style={{display: (this.state.startUpload ? 'block' : 'none')}} onMouseDown={this.stopEvent} onTouchStart={this.stopEvent}>
					<Progress type="circle" percent={this.state.percentage} />
				</div>

				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>
			</div>
		)
	}
});