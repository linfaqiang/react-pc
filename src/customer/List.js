import React from 'react';
import TableView from '../core/components/TableList/TableView.js';

import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import TabSelect from '../core/components/PublicSelect/TabSelect.js';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo';
import Dicts from '../core/common/dicts.js';
import ThreeLevel from '../core/components/ThreeLevel/threeLevel';
import Alert from '../core/components/alert.js';
import ImportData from './ImportData';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import { Progress } from 'antd';

var AreaComponents = React.createFactory(ThreeLevel);


module.exports = React.createClass({

	getInitialState:function(){
		var permit = UserInfo.getRolePermit();
		var data = {
			startUpload: false,
			percentage: 0,
			permit: permit,
			prov: '',        //三级联动
			city: '',
			county: '',
			initParam:{           //筛选参数
				"q":"",
				"orderType": 0,
				"isSelf": 0,
				"adcode":"",
				"customerLevelIds": [],
				"startCreatedOn":"",
				"endCreatedOn":"",
				"employeeId": [],
				"staffIds": [],
				"staffIdList": [],
				"pageNo":1,
				"pageSize":10,
				"url":APIS.customerDetail+'all',
				"fetchType":'post'
			},
			selectPP:{                //存放帅选框的数据
				value1: '',
				value2: '',
				data1: [
					{ text: '中国移动', id: 1 },
					{ text: '中国联通', id: 2 },
					{ text: '美国移动', id: 3 },
					{ text: '到达利亚移动', id: 4 }
				],
				data2: [
					{ text: 'A级', id: 1 },
					{ text: 'B级', id: 2 },
					{ text: 'C级', id: 3 },
					{ text: 'D级', id: 4 }
				]
			},
			selectShow:false,      //帅选框显示/隐藏
			liList:[{               //帅选类型
				name:'全部客户',
				index:0
			},{
				name:'我的客户',
				index:1
			},{
				name:'待分配的客户',
				index:2
			},{
				name:'已关注的客户',
				index:3
			}],
			curentSelect:{         //当前帅选到的类型
				name:'全部客户',
				index:0
			},
			tableData:{                                      //存放表头
				tableName:'customer',
				th:[
					{
						name:'客户',
						width:146
					},{
						name:'地址',
						width:220
					},{
						name:'责任人',
						width:96
					},{
						name:'创建时间',
						width:155
					},{
						name:'最后跟进时间',
						width:260
					}
				],
				tr:['name','address','ownerStaffName','createdOn','lastOperatedOn']
			},
			staffList:[],
			customerNum:0,
			hideStaffList: false //如果列表是我关注的客户，则隐藏筛选功能中的指定人员选项
		};
		if(!permit.isLeader){
			data.curentSelect = {
				name:'我的客户',
				index:1
			};
			data.liList = [{
				name:'我的客户',
				index:1
			},{
				name:'已关注的客户',
				index:3
			}];

			data.initParam.isSelf = 1;
			data.initParam.url = APIS.customerDetail + 'search';
			data.initParam.fetchType = 'post';
		}
		return data;
	},//customers/import-excel、customers/export-excel


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
		req.open("POST", APIS.importCustomerExcel, true);
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
		window.open(APIS.exportCustomerExcel);
	},//导出


	setSelectType:function (index,text) {
		this.setState({
			curentSelect:{
				name:text,
				index:index
			}
		});
		var url_head = APIS.customerDetail;
		
		if(index == 3){
			this.setState({hideStaffList: true});
		}else{
			this.setState({hideStaffList: false});
		}

		if(!this.state.permit.isLeader){
			switch(index){
				case 1:
					this.state.initParam.isSelf = 1;
					this.state.initParam.url = url_head + 'search';
					this.state.initParam.fetchType = 'post';
					break;
				case 3://todo:已关注的客户
					this.state.initParam.isSelf = 0;
					this.state.initParam.url = url_head + 'focus-customer';
					this.state.initParam.fetchType = 'post';
					break;
				default:
					break;
			}
			/*this.state.initParam.isSelf = 1;
			this.state.initParam.url = url_head + 'search';
			this.state.initParam.fetchType = 'post';*/
		}else{
			switch(index){
				case 0:
					this.state.initParam.isSelf = 0;
					this.state.initParam.url = url_head + 'all';
					this.state.initParam.fetchType = 'post';
					break;
				case 1:
					this.state.initParam.isSelf = 1;
					this.state.initParam.url = url_head + 'search';
					this.state.initParam.fetchType = 'post';
					break;
				case 2:
					this.state.initParam.isSelf = 2;
					this.state.initParam.url = url_head + 'leader';
					this.state.initParam.fetchType = 'get';
					break;
				case 3://todo:已关注的客户
					this.state.initParam.isSelf = 0;
					this.state.initParam.url = url_head + 'focus-customer';
					this.state.initParam.fetchType = 'post';
					break;
				default:
					break;
			}
		}

		//this.state.initParam['isSelf'] = index;
		this.setState(this.state.initParam);

		this.clearFilterState();
		//this.resetParam();

		this.getData(this.state.initParam);
	},

	componentWillMount:function(){

	},

	componentDidMount:function(){
        var self = this;
		this.getData(this.state.initParam);
		this.getStaff();
        Dicts.get(function(){
            var data = window.Dicts.CUSTOMER_LEVEL;
            var opt = new Array();

            for(var key in data){
                opt.push(data[key]);
            }
            self.state.selectPP.data2 = opt;
            self.setState(self.state.selectPP);
        });
	},
	
	confirmSelect:function () {      //保存后进行查询
		this.setState({
			selectShow:false
		});
		
		this.state.initParam['q'] = this.refs.kehuName.value;
		this.refs.customerLevels.el.val() ?
			this.state.initParam['customerLevelIds'].push(this.refs.customerLevels.el.val()) :
			(this.state.initParam['customerLevelIds'] = []);

		/*this.refs.staffs.el.val() ?
		this.state.initParam['employeeId'].push(this.refs.staffs.el.val()) :
			(this.state.initParam['employeeId'] = []);*/
		if(this.refs.staffs.el.val()){
            this.state.initParam['employeeId'] = [];
            this.state.initParam['staffIdList'] = [];
			//this.state.initParam['employeeId'] = this.refs.staffs.el.val();
			//this.state.initParam['staffIdList'] = this.refs.staffs.el.val();
			this.state.initParam.staffIdList.push(this.refs.staffs.el.val());
			this.state.initParam.employeeId.push(this.refs.staffs.el.val());
		}else{
			this.state.initParam['employeeId'] = [];
			this.state.initParam['staffIdList'] = []
		}

		this.state.initParam['adcode'] = this.state.county;
		this.setState(this.state.initParam);
		
		this.getData(this.state.initParam);
	},

	clearFilterState:function(){
		this.refs.kehuName.value = '';
		this.refs.customerLevels.setValue('');
		this.refs.staffs.setValue('');

		this.setState({
			prov: '',
			city: '',
			county: ''
		});

		this.refs.areaSelect.resetStates({
			prov: '',
			city: '',
			county: ''
		});

		this.state.initParam['q'] = '';
		this.state.initParam['customerLevelIds'] = [];
		this.state.initParam['staffIdList'] = [];
		this.state.initParam['staffIds'] = [];
		this.state.initParam['employeeId'] = [];
		this.state.initParam['adcode'] = '';
		this.state.initParam.pageNo = 1;
		//this.state.initParam.isSelf = this.state.curentSelect.index;
		this.setState(this.state.initParam);
		//this.setState({selectShow:false});
	},

	clearMoreSelect:function () {
		var self = this;
		self.clearFilterState();
		this.getData(this.state.initParam);
	},

	selectShowHide:function (e) {
		//e.preventDefault();
		this.setState({
			selectShow:!this.state.selectShow
		})
	},

	resetParam:function (param) {
		/*{
		 "q":param.q,
		 "orderType": param.orderType,
		 "isSelf": param.isSelf,
		 "adcode":param.adcode,
		 "customerLevelIds": param.customerLevelIds,
		 "startCreatedOn": param.startCreatedOn,
		 "endCreatedOn":param.endCreatedOn,
		 "employeeId": param.employeeId,
		 "staffIds": param.staffIds,
		 "pageNo": param.pageNo,
		 "pageSize": param.pageSize
		 }*/
		return  {           //筛选参数
			"q": param.q || "",
			"orderType": param.orderType || 0,
			"isSelf": param.isSelf || 0,
			"adcode": param.adcode||"",
			"customerLevelIds": param.customerLevelIds|| [],
			"startCreatedOn": param.startCreatedOn||"",
			"endCreatedOn": param.endCreatedOn||"",
			"employeeId": param.employeeId||[],
			"staffIds": param.staffIds||[],
			"staffIdList": param.staffIdList||[],
			"pageNo":param.pageNo||1,
			"pageSize":param.pageSize||10,
			"url":APIS.customerDetail+(param.pageSize.url||'all'),
			"fetchType": param.pageSize||'post'
		}

	},

	getData:function (param) {
		var self = this,
			thisUrl = self.state.initParam.url+'?pageSize='+param.pageSize+'&pageNo='+param.pageNo;

		self.refs.customerList.beginLoad(param.pageNo);
		if(param.fetchType == 'get'){
			AjaxRequest.get(thisUrl, param, function(body) {

				self.refs.customerList.setPagerData(body);
				self.setState({
					customerNum:body.totalSize
				})

			});
		}else{
			AjaxRequest.post(thisUrl, param, function(body) {

				self.refs.customerList.setPagerData(body);
				self.setState({
					customerNum:body.totalSize
				})

			});
		}



	},
	getStaff:function () {
		var self = this;

		AjaxRequest.get(APIS.staffs_subs, null, function(body) {

			self.setState({
				staffList:body.data
			})

		});

	},
	selectProvs: function (data) {
		this.setState({
			prov: data,
			city: '',
			county: ''
		})
	},
	selectCitys: function(data){
		this.setState({
			city: data,
			county: ''
		})
	},
	selectCountys: function(data){
		this.setState({
			county: data
		})
	},


	render:function(){

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper form-inline no-footer">
								<div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:-12+'px',top:34+'px'}}>
									<div className="well with-header" style={{background:'#fff',height:'100%'}}>
										<div className="header bordered-blue">
											<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
												<button onClick={this.clearMoreSelect} className="btn btn-default">重置</button>
												<button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
											</div>
										</div>
										<form style={{marginTop:30+'px',paddingLeft:10+'px'}}>
											<div className="form-group form-li" >
												<label>客户</label><br/>
												<input type="text" ref="kehuName" className="form-control" />
											</div>
											<div className="form-li">
												客户等级<br/>
												<Select2
													ref="customerLevels"
													multiple={false}
													data={this.state.selectPP.data2}
													value={ this.state.selectPP.value2 }

												/>
											</div>

											<div className="area-select  form-li">
												地区<br/>
												{
													AreaComponents({
														ref:'areaSelect',
														data: __areaData__,
														options: {
															prov:this.state.prov || '',
															city:this.state.city || '',
															county:this.state.county || '',
															defaultText:['省份','城市','区县']
														},
														selectProvs:this.selectProvs,
														selectCitys:this.selectCitys,
														selectCountys:this.selectCountys
													})
												}

											</div>

											<div className="form-li" style={{display: (this.state.hideStaffList ? 'none' : 'block')}}>
												指定人员<br/>
												<Select2
													ref="staffs"
													multiple={false}
													data={this.state.staffList}
													value=""

												/>
											</div>
											
										</form>
									</div>
								</div>
								<div className="DTTT btn-group" style={{right:0+'px'}}>
									<a className="btn btn-default DTTT_button_copy" href="#/customer/add/a">
										<i className="fa fa-plus"></i>
										<span>创建 </span>
									</a>
									<a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
										<i className="fa fa-filter"></i>
										<span>筛选 <i className="fa fa-angle-down"></i></span>
									</a>
									<a className="btn btn-default DTTT_button_collection"  data-toggle="modal" data-target="#importDataModal">
										<i className="glyphicon glyphicon-save"></i>
										<span>导入</span>
										{/*<form ref="fileForm" style={{display:'none'}}> onClick={this.selectHandle}
											<input ref="filed" type="file"
												   onChange={this.handleFiles}
												   style={{display:'none'}}/>
										</form>*/}
									</a>
									<a className="btn btn-default DTTT_button_collection" onClick={this.exportData}>
										<i className="glyphicon glyphicon-open"></i>
										<span>导出</span>
									</a>
								</div>
								<div style={{marginBottom:8+'px'}}>
									<TabSelect liList={this.state.liList}
											   curentSelect={this.state.curentSelect}
											   setSelectType={this.setSelectType}/>
									<span className="margin-left-10"></span>
								</div>

								{/*<List ref="customerList" getData={this.getData} initParam={this.state.initParam}  tableData={this.state.tableData}/>*/}
								<TableView ref="customerList" getData={this.getData} tableData={this.state.tableData} initParam={this.state.initParam}></TableView>
							</div>
						</div>
					</div>
				</div>

				<div className="uploadProgress" style={{display: (this.state.startUpload ? 'block' : 'none')}} onMouseDown={this.stopEvent} onTouchStart={this.stopEvent}>
					<Progress type="circle" percent={this.state.percentage} />
				</div>

				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>

				<div className="container-fluid text-center">
					<ImportData></ImportData>
				</div>
			</div>
		)
	}
});