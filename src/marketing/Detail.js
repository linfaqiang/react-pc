import React from 'react';
import {hashHistory} from 'react-router';
import '../core/components/Select2/select2.css';
import CONFIG from '../core/common/config';
import DetailTable from '../core/components/DetailTable/List';
import ChanceList from './ChanceList';
import ClueList from './ClueList';
import TaskList from './TaskList';
import ImgList from './components/ImgList';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import UserInfo from '../core/common/UserInfo.js';
import { Modal, Button } from 'antd';
const confirm = Modal.confirm;

module.exports = React.createClass({

	getInitialState:function(){ 
		return {
			routeId: this.props.params.marketId,
			isManger: UserInfo.isManager(),
			tableData:{
				firstList:[
					{
						name: '举办类型',
						value: '',
						filed:'activityType',
						iconClass:'yellow pcicon-marketingType'
					}, {
						name: '举办单位',
						value: '',
						filed:'organizer',
						iconClass:'blue pcicon-unit2'
					},{
						name: '地址',
						value: '',
						filed:'address.address',
						iconClass:'green pcicon pcicon-addr'
					},{
						name: '规模',
						value: '',
						filed:'activitySize',
						iconClass:'red  pcicon pcicon-business'
					}
				],
				lists: []
			},
			trackData: {            //跟进记录
				pageNo: 1,
				pageSize: 5
			},
			imgList:[],
			taskList:[],         //未完成任务
			chanceList:[],       //商机列表
			clueList:[]          //线索列表
				
		}
	},

	componentWillMount:function(){

	},

	componentDidMount:function(){
		this.getData();
		/*this.getTracks({   //跟进记录
			pageNo:1,
			pageSize:5
		});*/
		let tab = this.props.location.query.tab;
		if (tab) {
			$('#myTab11 li').removeClass('active');
			$('.tab-pane').removeClass('active');
			$('#'+tab).addClass('active');
			if(tab == 'otherInfo'){
				$('#myTab11 li').eq(1).addClass('active');
				this.getOtherMsg();
			}else{
				$('#myTab11 li').eq(0).addClass('active');
			}
		}
	},
	setFirstList:function (data) {      //设置首行列表
		var list = this.state.tableData.firstList;
		for(var i=0,len=list.length; i<len; i++){
			var field = list[i].filed;
			if(field.split('.').length == 2){
				var arrs = field.split('.'),
					arr_1 = arrs[0],
					arr_2 = arrs[1];
				list[i].value = data[arr_1][arr_2];
			}else{
				list[i].value = data[field];
			}

		}
	},

	getData:function () {
		var self = this;
		var url = CONFIG.APIS.market_detail+'/'+self.state.routeId;
		
		AjaxRequest.get(url, null, function(res){
			var data = res.data;
			// var data = JSON.parse(Base64.decode(res.data));

			self.state.tableData.lists = data;
			self.setFirstList(data); //设置首行列表数据
			self.state.imgList=data.picUrlList;
			self.setState(self.state.tableData);
			
			self.refs.imgList.setState({imgList: data.picUrlList});
			self.refs.imgList.initPrevwer();
       });
	},
	//机会列表
	getChances:function () {
		var self = this,
			thisUrl = CONFIG.APIS.market_detail+'/'+self.state.routeId + '/chance';
		AjaxRequest.get(thisUrl, null, function(data){
        	
        	self.setState({
							chanceList:data.data
						});
       });	
	},	
	//任务
	getTaskList:function(){
		var self = this,
			taskUrl = CONFIG.APIS.market_detail+'/'+self.state.routeId + '/saleTask?undone=1';
		AjaxRequest.get(taskUrl, null, function(data){
        	
        	self.setState({
							taskList:data.data
						});
       });	
	},
	//线索
	getClues:function () {
		var self = this,
			thisUrl = CONFIG.APIS.market_detail+'/'+self.state.routeId + '/clue';
		AjaxRequest.get(thisUrl, null, function(data){
        	
        	self.setState({
							clueList:data.data
						});
       });
	},	
	getOtherMsg:function () {
		this.getTaskList();
		this.getChances();
		this.getClues();
	},
	
	contextTypes: {
		router: React.PropTypes.object
	},	
	
	addClue:function () {
		/*this.context.router.push({
			pathname: '/clue/add/0',
			query: {
				sourceId:  this.state.routeId,
				fromEntityType: 'MARKETING_ACTIVITY'
			}
		});*/
		var marketId = this.state.routeId;
		hashHistory.push(`/marketing/${marketId}/addClue/0?sourceId=${marketId}&fromEntityType=MARKETING_ACTIVITY`);
	},	
	addChance:function () {
		/*this.context.router.push({
			pathname: '/chance/add/0',
			query: {
				sourceId:  this.state.routeId,
				fromEntityType: 'MARKETING_ACTIVITY'
			}
		});*/
		var marketId = this.state.routeId;
		hashHistory.push(`/marketing/${marketId}/addChance/0?sourceId=${marketId}&fromEntityType=MARKETING_ACTIVITY`);
	},
	addTask:function () {
		/*this.context.router.push({
			pathname: '/task/add/0',
			query: {
				sourceId:  this.state.routeId,
				fromEntityType: 'MARKETING_ACTIVITY'
			}
		});*/
		var marketId = this.state.routeId;
		hashHistory.push(`/marketing/${marketId}/addTask/0?sourceId=${marketId}&fromEntityType=MARKETING_ACTIVITY`);
	},
	addSchedule:function(){
		$('#addScheduleModal').modal('show')
	},

	deleteData: function(e){
		e.preventDefault();
		e.stopPropagation();
		var self = this;
		confirm({
			title: '是否删除',
			content: '数据删将被删除',
			onOk() {
				var	thisUrl = CONFIG.APIS.market_detail+'/'+self.state.routeId;
				AjaxRequest.delete(thisUrl, null, function(data){
					if (data.code == 200) {
						history.go(-1);
					} else {
						toastr.error('删除数据失败：'+data.msg);
					}
				});
			},
			onCancel() {
				return false;
			}
		});
	},
	
	render:function(){
		var self = this;
		var isManger = this.state.isManger;

		function renderEditBtn(){
			if(!isManger) return null;
			return (
				<a className="crm_edit pcicon pcicon-edit" href={"#/marketing/"+self.state.routeId+'/edit'}></a>
			);
		}
		function renderDelBtn(){
			if(!isManger) return null;
			return (
				<span className="crm_edit fa fa-trash-o" onClick={self.deleteData}></span>
			);
		}
		function renderClueList(){
			if(CONFIG.Exclude && CONFIG.Exclude.clue) return null;
			return (
				<div className="detail-tab3">
					<ClueList lists={self.state.clueList} marketingId={self.state.routeId}/>
				</div>
			);
		}
		function renderChanceList(){
			if(CONFIG.Exclude && CONFIG.Exclude.chance) return null;
			return (
				<div className="detail-tab3">
					<ChanceList lists={self.state.chanceList} marketingId={self.state.routeId}/>
				</div>
			);
		}
		function renderClueBtn(){
			if(CONFIG.Exclude && CONFIG.Exclude.clue) return null;
			return (
				<div className="glyphicon glyphicon-plus" onClick={self.addClue}>线索</div>
			);
		};
		function renderChanceBtn(){
			if(CONFIG.Exclude && CONFIG.Exclude.chance) return null;
			return (
				<div className="glyphicon glyphicon-plus" onClick={self.addChance}>商机</div>
			);
		};
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body noTopPadding">
					<div className="row">
						<div className="page-header position-relative">
							<div className="header-title">
								<h1>
									{this.state.tableData.lists.subject}
									{renderEditBtn()}
									{renderDelBtn()}
								</h1>
							</div>
							<div className="header-buttons">
								{renderClueBtn()}
								{renderChanceBtn()}
								<div className="glyphicon glyphicon-plus" onClick={this.addTask}>任务</div>
								<div className="glyphicon glyphicon-plus" onClick={this.addSchedule}>日程</div>
							</div>
						</div>
					</div>
					<div className="detail-table">
						<DetailTable lists={this.state.tableData.firstList} />
					</div>
					<div className="row">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="dashboard-box">
							<div className="box-tabbs">
								<div className="tabbable">
									<ul className="nav nav-tabs myTab" id="myTab11">
										<li className="active">
											<a data-toggle="tab" href="#customer-khxq">
												市场活动详情
											</a>
										</li>
										
										<li onClick={this.getOtherMsg}>
											<a data-toggle="tab" href="#otherInfo">
												其他相关
											</a>
										</li>
									</ul>
									<div className="tab-content tabs-flat detail-left">
										<div id="customer-khxq" className="tab-pane animated fadeInUp active">
											<div className="row">
												<div className="col-lg-12">
													<ImgList ref="imgList" lists={this.state.imgList}/>
													
												</div>
											</div>
											<div className="row">
												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
													<div className="">
														<h5 >开始时间</h5>
														<p>{this.state.tableData.lists.startTime}</p>
													</div>
												</div>
												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
													<div className="">
														<h5>结束时间</h5>
														<p>{this.state.tableData.lists.endTime}</p>
													</div>
												</div>
												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
													<div className="">
														<h5 >规模</h5>
														<p>{this.state.tableData.lists.activitySize}</p>
													</div>
												</div>
												<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
													<div className="">
														<h5>目标群体</h5>
														<p>{this.state.tableData.lists.targetGroups}</p>
													</div>
												</div>
												<div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
													<div className="">
														<h5 >活动内容</h5>
														<div dangerouslySetInnerHTML={{__html: this.state.tableData.lists.content}} />
													</div>
												</div>


											</div>
										</div>

										<div id="customer-sj" className="tab-pane">
										</div>
										<div id="otherInfo" className="tab-pane animated fadeInUp">
											<div className="detail-tab3">
												<TaskList lists={this.state.taskList} marketingId={this.state.routeId}/>
											</div>
											{renderClueList()}
											{renderChanceList()}
										</div>
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