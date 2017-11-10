import React from 'react';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import Select2 from '../core/components/Select2/Select2.js';
import '../core/components/Select2/select2.css';
import TabSelect from './TabSelect.js';
import request from 'superagent';
import {APIS} from '../core/common/config';
import Detail from './Detail';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {Pagination, Select} from 'antd';


module.exports = React.createClass({
	getInitialState:function(){ 
		return {
			canExport: false,
			changed: false,
			initParam:{           //筛选参数
				"id":"",
				"reportType":-1,
				"pageNo":1,
				"pageSize":10,
				"isViewMe":0,
				"endEndTime":"",
				"startStartTime":""

			},
			selectShow:false,      //帅选框显示/隐藏
			liList:[{               //帅选类型
				name:'全部工作报告',
				index:0
			},{
				name:'我发起的',
				index:1
			},{
				name:'我收到的',
				index:2
			}],
			curentSelect:{         //当前帅选到的类型 
				name:'全部工作报告',
				index:0
			},
			tableData:{                                      //存放表头
				tableName:'working',
				url:APIS.work_report_list,
				th:[
					{
						name:'产品名称',
						width:146
					},{
						name:'类别',
						width:220
					},{
						name:'产品价格',
						width:96
					}
				],
				tr:['productName','productTypeText','productPrice']
			},
			selectPP:{
				dataStatus: [
					{ text: '所有', id: 3 },
					{ text: '日报', id: 0 },
					{ text: '周报', id: 1 },
					{ text: '月报', id: 2 }
				]
			},
			detailData:{},
			lists:[],
			thisDataStatus:"",
			/*pageData:{
				currentPage:1,
				totalSize:0,
				num:0
			},*/
			pageData: {
				pageNo: 1,
				totalSize: 0,
				pageSize: 10
			},
			hideNoData: true
		}
	},

	setStageValue:function () {
		var self=this;
		var stage = self.refs.chanceStage.el.val();
		if(stage == -1){
			stage = null;
		}
		self.state.selectPP.stageList = stage;
		self.setState(self.state.selectPP);
	},
	setSelectType:function (index,text) {
		var self=this;
		self.setState({
			curentSelect:{
				name:text,
				index:index
			}
		});
		self.clearValue();
		//选择类型后,ulr不同
		if(index==2){
			self.state.initParam.isViewMe=1;
			self.isViewMegetData(self.state.initParam);
		}else if(index==1){
			self.state.initParam.isViewMe=0;
			self.isViewMegetData(self.state.initParam);
		}else if(index==0){
			self.getData(self.state.initParam);
		}
	},
	componentWillMount:function(){
	},
	componentDidMount:function(){
		var self=this;
		self.getData(self.state.initParam);
		$('.date-picker').datepicker({
			local:'ZH_CN'
		});
	},
	confirmSelect:function () {      //保存后进行查询
		var self=this;
		self.setState({
			selectShow:false
		});
		var fields = self.refs, params = {};
		for (var attr in fields) {
			if(attr == 'workStatus'){
				params[attr] = parseInt(self.refs[attr].el[0].value);
			}else{
				params[attr] = self.refs[attr].value;
			}
		}
		self.state.initParam.reportType=params.workStatus;
		self.state.initParam.startStartTime=params.workTimeStart;
		self.state.initParam.endEndTime=params.workTimeEnd;

		self.setState(self.state.initParam);
		self.getData(self.state.initParam);
	},
	screeningData:function (param) {
		var self = this;
		AjaxRequest.post(APIS.work_report_add+'/search?'+'pageNo='+self.state.initParam.pageNo+'&pageSize='+self.state.initParam.pageSize, param, function(body) {
			if (body.msg=='OK') {
				if (body.code == '200' && body.data) {
					self.setPagerData(body);
				}
				if(body.data.length){
					self.clickBack(body.data[0].id)
				}

			} else {
				console.log('请求失败!')
			}
		})
	},
	clearValue:function () {
		var self=this;
		self.state.initParam={
			"reportType":-1,
				"pageNo":1,
				"pageSize":10,
				"isViewMe":0,
				"endEndTime":"",
				"startStartTime":""
		};
		self.state.pageData = {
			pageNo: 1,
			totalSize: 0,
			pageSize: 10
		}
	},
	cancerSelect:function () {
		var self=this;
		self.refs.workTimeStart.value='';
		self.refs.workTimeEnd.value='';
		self.refs.workStatus.setValue('');
	},
	selectShowHide:function () {
		var self=this;
		self.setState({
			selectShow:!self.state.selectShow
		});
	},
	setPagerData:function(data){
		var self = this;
		var param = self.state.pageData;

		param.pageNo = self.state.initParam.pageNo || data.pageNo || 1;
		param.totalSize = data.totalSize || 0;
		param.pageSize = self.state.initParam.pageSize || data.pageSize || 10;

		self.setState({
			lists: data.data,
			pageData: param
		});
	},
	PageChange:function(page){
		var self = this;
		var initParam = self.state.initParam;

		initParam.pageNo = page;
		self.setState({initParam: initParam});
		self.getData(initParam);
	},
	getData:function (param) {
		var self = this,
			queryFn=self.props.location.query;
		if(queryFn){
			self.state.initParam.id=queryFn.messegeId;
			self.setState(self.state.initParam);
		}
		AjaxRequest.get(APIS.work_report_getall, param, function(body) {
			if (body.msg=='OK') {
				if(body.data.length>0){
					self.state.canExport = true;
				}else{
					self.state.canExport = false;
				}
				if (body.code == '200' && body.data) {
					self.setPagerData(body);
				}
				if(body.data.length){
					self.clickBack(body.data[0].id);

					self.refs.detailDiv.setNoData(true);
					self.setState({
						hideNoData: true
					});
					window.scroll(0,0);
				}else{
					self.setState({
						detailData:{},
						hideNoData: false
					});
					self.refs.detailDiv.setNoData(false);
				}

			} else {
				console.log('请求失败!')
			}
		})
	},
	isViewMegetData:function (param) {
		var self = this;
		request
			.post(self.state.tableData.url+'?pageNo='+param.pageNo
				+ '&pageSize='+param.pageSize)
			.send(param)
			.set('Content-Type', 'application/json;charset=utf-8')
			.end(function(err,res){
				if (res.ok) {
					if(res.body.data.length>0){
						self.state.canExport = true;
					}else{
						self.state.canExport = false;
					}
					if (res.body.code == '200' && res.body.data) {
						self.setPagerData(res.body);
					}
					if(res.body.data.length){
						self.clickBack(res.body.data[0].id);

						self.refs.detailDiv.setNoData(true);
						self.setState({
							hideNoData: true
						});
						window.scroll(0,0);
					}else{
						self.setState({
							detailData:{},
							hideNoData: false
						});
						self.refs.detailDiv.setNoData(false);
					}

				} else {
					console.log('请求失败!')
				}
			});
	},
	clickBack:function (id) {
		var self = this;
		self.workListBackground();
		request
			.get(APIS.work_report_detail+id)
			.send('')
			.set('Content-Type', 'application/json;charset=utf-8')
			.end(function(err,res){
				if (res.ok) {
					if (res.body.code == '200' && res.body.data) {
						self.setState({
							detailData:res.body.data
						});
					}
				} else {
					console.log('请求失败!')
				}
			});
	},
	workListBackground: function(){
		var h = document.getElementsByClassName("workListBackground");
			for(var i=0;i<h.length;i++){
			h[i].onclick=function(){
				//重置颜色
				for(var k=0;k<h.length;k++){
					h[k].style.backgroundColor="#fff";
				}
				//设置当前的样式
				this.style.backgroundColor="#f5f5f5";
			}
		}
	},
	handleChange: function () {
		this.state.initParam.reportType = this.refs.workStatus.el.val();
	},
	workTimeStart: function () {
		return(
			<div className="workScreening">
				<label className="workTimeLabel">创建时间起</label>
				<div className="input-group">
					<input className="form-control date-picker" ref="workTimeStart" name="extimateDealDate"
						   id="extimateDealDate" type="text" placeholder="请选择创建时间起"
						   data-date-format="yyyy-mm-dd" />
											<span className="input-group-addon">
												<i className="fa fa-calendar" />
											</span>
				</div>
			</div>
		)
	},
	workTimeEnd:function () {
		return(
			<div className="workScreening">
				<label className="workTimeLabel">创建时间止</label>
				<div className="input-group">
					<input className="form-control date-picker" ref="workTimeEnd" name="extimateDealDate"
						   id="extimateDealDate" type="text" placeholder="请选择创建时间止"
						   data-date-format="yyyy-mm-dd" />
											<span className="input-group-addon">
												<i className="fa fa-calendar" />
											</span>
				</div>
			</div>
		)
	},
	exportData:function(){
		if(this.state.canExport){
			window.open(APIS.exportWorkReport);
		}else{
			toastr.error('当前查询结果为空，请重设查询条件');
		}
	},//导出
	render:function(){
		var lists = this.state.lists;
		var lis = lists.map(function(qst,key){
			return<li className="workListBackground" key={key} onClick={this.clickBack.bind(this,qst.id)}>
						<p className="titleWork">{qst.createdName}</p>
						<p className="contentOne">{qst.summary}</p>
					<span className="workTime">{qst.createdOn}</span>
					<span style={{color:qst.status==0 ? '#78c767' : '#3e97cf'}} className="workStatus">{qst.statusText}</span>
				</li>
		}.bind(this) );

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params}/>
				<div className="page-body workingLeftAll">
					<div className="widget lists">
						<div className="widget-body">
							<div role="grid" id="editabledatatable_wrapper" className="dataTables_wrapper no-footer">
								<div style={{display:this.state.selectShow ? 'block' : 'none', width:380+'px',height:400+'px', zIndex:100, position:'absolute',right:0,top:42+'px'}}>
									<div className="well with-header" style={{background:'#fff',height:'100%'}}>
										<div className="header bordered-blue">
											<div className="buttons-preview" style={{textAlign:'right',paddingTop:10+'px'}}>
												<button onClick={this.cancerSelect} className="btn btn-cancer">重置</button>
												<button onClick={this.confirmSelect} className="btn btn-danger">确定</button>
											</div>
										</div>
										<form style={{marginTop:30+'px',paddingLeft:10+'px'}}>

											<div className="">
												<label htmlFor="workStatus">类型</label>
												<div className="input-icon icon-right">
													<Select2
														ref="workStatus"
														name="workStatus"
														value={this.state.thisDataStatus}
														multiple={false}
														style={{width:"100%"}}
														onSelect={this.handleChange}     //选择回调 ,如果是单选,只调用这个就行了
														data={this.state.selectPP.dataStatus}
														options={{placeholder: '所有'}}
													/>
												</div>
											</div>

											{this.workTimeStart()}
											{this.workTimeEnd()}
										</form>
									</div>
								</div>

								<div className="row">
									<div id="dropdownbuttons" className="activityDropdownbuttons">
										<TabSelect liList={this.state.liList}
												   curentSelect={this.state.curentSelect}
												   setSelectType={this.setSelectType}/>
										<div className="DTTT btn-group" style={{right:3+'px',zIndex:100,top:'-5px'}}>
											<a className="btn btn-default DTTT_button_copy" href="#/working/add/a">
												<i className="fa fa-plus" />
												<span>创建 </span>
											</a>
											<a onClick={this.selectShowHide} className="btn btn-default DTTT_button_collection">
												<i className="fa fa-filter" />
												<span>筛选 <i className="fa fa-angle-down" /></span>
											</a>
											<a className="btn btn-default DTTT_button_collection dropdown-toggle" onClick={this.exportData}>
												<i className="glyphicon glyphicon-open"></i>
												<span>导出</span>
											</a>
											{/*
											 data-toggle="dropdown"
											<ul className="dropdown-menu dropdown-blue listType" style={{marginLeft:'121px', width:'75px'}}>
												<li>
													<a>导出日报</a>
												</li>
												<li>
													<a>导出周报</a>
												</li>
												<li>
													<a>导出月报</a>
												</li>
												<li>
													<a>删除</a>
												</li>
											</ul>*/}
										</div>
									</div>
									<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 col-work-left">
										<div className="workLeftContent">

											<div className="workList" style={{minHeight: '698px', paddingBottom:'48px', position:'relative'}}>
												<ul className="workList_ul">
													{lis}
												</ul>
												<div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '20%', left:'50%', position:'absolute'}}><div className='crmNoData'>暂无数据</div></div>
												<div style={{position:'absolute', right:'0px', bottom:'10px'}}>
													<Pagination
														selectComponentClass={Select}
														total={this.state.pageData.totalSize}
														showTotal={total => `共 ${total} 条记录`}
														pageSize={this.state.pageData.pageSize}
														defaultCurrent={this.state.pageData.pageNo}
														current={this.state.pageData.pageNo}
														onChange={this.PageChange}
														showQuickJumper
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 col-work-right">
										<div className="workRightContent">
											<Detail ref="detailDiv" detailData={this.state.detailData} clickBack={this.clickBack} getData={this.getData}/>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});