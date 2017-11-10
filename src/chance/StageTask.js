import React, { Component } from 'react';
import {Link, hashHistory} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import StageNav from '../core/components/ChanceStage/StageNav';
import TaskList from '../core/components/ChanceStage/TaskList';
import TaskDetail from '../core/components/ChanceStage/TaskDetail';
import CurrentPosition from '../core/components/layout/CurrentPosition';

module.exports = React.createClass({

	getInitialState:function(){ 
		return {
			chanceId: this.props.params.chanceId,
			chanceName:"",
			stageId: this.props.params.chanceStageId,
			stageTaskCountList:[],
			taskList:[],
			currentId:null,
			detailData:{},
			isShow:false,
			action:"",
			isSort:false,//是否进行过排序操作
			isColsed: false
		}
		
	},

	componentWillMount:function(){

	},
	componentDidMount:function(){
		this.getData();
		this.getStageTaskCount();
		this.getTaskList(this.state.stageId);
		/*if(this.props.location.query.disableFun=='true'){
			this.setState({disableFun: true});
		}*/
	},

	getStageTaskCount:function(){
		//console.log('start-->getStageTaskCount');
		var self = this;
		var url = APIS.chance_stage.replace('{id}',this.state.chanceId);
		AjaxRequest.get(url, null, function(data) {
			if (data.code == 200) {
				self.setState({
					stageTaskCountList:data.data
				});
				//添加滚动
				self.refs.StageNav.scrollLayer();
				//console.log('end-->getStageTaskCount');
			}
		})
	},
	getTaskList:function(stageId){
		//console.log('getTaskList2');
		var self = this;
		var url = APIS.chance_stage_task.replace('{id}',this.state.chanceId)+"?stageId="+stageId;
		AjaxRequest.get(url, null, function(data) {
			//console.log('getTaskList3');
			if (data.code == 200) {
				self.setState({
					taskList:data.data,
					currentId:data.data[0].id,
					detailData:data.data[0],
					stageId:stageId,
					isShow:false,
					isSort:false
				});

				//console.log('end-->getTaskList');
			}
		})
	},
	clickBack:function (id) {
		//console.log('clickBack id:'+id);
		var list = this.state.taskList;
		var detail = null;
		for(var i=0;i<list.length;i++){
			var obj = list[i];
			if(id == obj.id){
				detail = obj;
				break;
			}
		}
		this.setState({
			currentId:id,
			detailData:detail,
			isShow:false
		});

		//console.log('end-->clickBack id:'+id);
	},

	getData:function () {
		//console.log('start-->getData');
		var self = this;
		AjaxRequest.get(APIS.chance_detail+self.state.chanceId, null, function(data) {
			if (data.code == 200) {
				self.setState({
					chanceName:data.data.chanceName,
					isColsed:data.data.isColsed
				});
				//console.log('end-->getData');
			}
		});
	},
	showForm:function(type){
		this.setState({
			isShow:true,
			action:type
		});
	},
	saveTask:function(params){
		//console.log('start-->saveTask'+JSON.stringify(params));
		var self = this;
		params.chanceId = self.state.chanceId;
		params.stageId = self.state.stageId;

		if(params && params.id){
			AjaxRequest.put(APIS.chance_update_stage_task+"/"+params.id, params, function(data) {
				if (data.code == 200) {
					self.getTaskList(self.state.stageId);
					//console.log('end-->saveTask');
				}
			});
		}else{
			AjaxRequest.post(APIS.chance_update_stage_task, params, function(data) {
				if (data.code == 200) {
					self.getStageTaskCount();
					self.getTaskList(self.state.stageId);
					//console.log('end-->saveTask');
				}
			});
		}

	},
	addTask: function(subject){
		//console.log('start-->saveTask');
		var self = this;
		var chanceId = self.state.chanceId;
		var chanceStageId = self.state.stageId;
		var customerId = self.props.location.query.customerId;
		hashHistory.push(`/chance/${chanceId}/stageTask/${chanceStageId}/addTask?subject=${subject}&customerId=${customerId}`);
	},
	delTask:function(id){
		//console.log('start-->delTask');
		var self = this;
		bootbox.confirm("确认删除吗?", function (result) {
			if (result) {
				AjaxRequest.delete(APIS.chance_update_stage_task+"/"+id, null, function(data) {
					if (data.code == 200) {
						self.getStageTaskCount();
						self.getTaskList(self.state.stageId);
					}
				});
			}
		});
	},
	executeTask:function(status){
		//console.log('start-->executeTask');
		var self = this;
		var params = {
			"chanceId":self.state.chanceId,
			"stageTaskId":self.state.detailData.stageTaskId,
			"status":status
		};
		//console.log('start-->executeTask2');
		AjaxRequest.put(APIS.chance_update_stage_task_status.replace('{id}',self.state.detailData.id), params, function(data) {
			if (data.code == 200) {
				self.getStageTaskCount();
				self.getTaskList(self.state.stageId);
				//console.log('end-->executeTask3');
			}
		});
	},
	move:function(taskId,type){
		//console.log('start-->move');
		var list = this.state.taskList;//任务列表

		if(type == "up"){
			for(var i=0;i<list.length;i++){
				var curObj = list[i];
				var curObjSortIndex = curObj.sortIndex;
				if(taskId == curObj.stageTaskId){//先处理任务list，交换位置以及更改sortIndex的值
					var preObj = list[i-1];
					var preObjSortIndex = preObj.sortIndex;
					curObj.sortIndex = preObjSortIndex;
					preObj.sortIndex = curObjSortIndex;
					list[i-1] = curObj;
					list[i] = preObj;
					break;
				}
			}
		}else{
			for(var i=0;i<list.length;i++){
				var curObj = list[i];
				var curObjSortIndex = curObj.sortIndex;
				if(taskId == curObj.stageTaskId){//先处理任务list，交换位置以及更改sortIndex的值
					var lastObj = list[i+1];
					var lastObjSortIndex = lastObj.sortIndex;
					curObj.sortIndex = lastObjSortIndex;
					lastObj.sortIndex = curObjSortIndex;
					list[i+1] = curObj;
					list[i] = lastObj;
					break;
				}
			}
		}
		//console.log('start-->move2');
		this.setState({
			taskList:list,
			isSort:true
		});
		//console.log('start-->move3');
	},
	updateSortIndex:function(){
		var self = this;
		var isSort = self.state.isSort;//是否进行过排序操作
		if(isSort){
			bootbox.confirm("任务排序位置已改变，确定要保存吗?", function (result) {
				if (result) {
					var list = self.state.taskList;
					var sortList = [];
					for(var i=0;i<list.length;i++){
						var newObj = {
							id:list[i].stageTaskId,
							sortIndex:list[i].sortIndex
						}
						sortList.push(newObj);
					}
					////console.log(sortList);
					var params = {
						sortIndexList:sortList
					}
					AjaxRequest.put(APIS.chance_update_stage_task, params, function(data) {
						if (data.code == 200) {
							self.getTaskList(self.state.stageId);
						}
					});
				}
			});
		}
	},

	render:function(){

		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body noTopPadding">
					<div className="row">
						<div className="page-header position-relative">
							<div className="header-title">
								<h1>{this.state.chanceName}</h1>
								{/*<a className="btn" href={`#/chance/${this.state.chanceId}`} style={{marginLeft:'15px',marginBottom:'5px'}}>
								 <i className="fa fa-mail-reply"></i>
								 <span>返回 </span>
								 </a>*/}
							</div>
						</div>
					</div>
					<StageNav ref="StageNav" stageId={this.state.stageId} lists={this.state.stageTaskCountList} getTaskList={this.getTaskList}/>
					<div className="row">
						<div className="col-lg-9 col-md-8 col-sm-12 col-xs-12">
							<TaskList lists={this.state.taskList} isColsed={this.state.isColsed} currentId={this.state.currentId} disableFun={this.state.disableFun} clickBack={this.clickBack} delTask={this.delTask} showForm={this.showForm} move={this.move} updateSortIndex={this.updateSortIndex}/>
						</div>
						<div className="col-lg-3 col-md-4 col-sm-12 col-xs-12" style={{marginTop: -1+'px'}}>
							<TaskDetail detailData={this.state.detailData} isColsed={this.state.isColsed} isShow={this.state.isShow} showForm={this.showForm} delTask={this.delTask} executeTask={this.executeTask} saveTask={this.saveTask} addTask={this.addTask} action={this.state.action}/>
						</div>
					</div>
				</div>

			</div>
		)
	}
});