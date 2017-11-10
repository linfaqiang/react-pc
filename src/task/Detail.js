import React, { Component } from 'react';
import {Link} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest.js';
import {APIS} from '../core/common/config';
import DetailInfo from './DetailInfo';
import ExecuteList from './ExecuteList';

import RemarkList from '../core/components/RemarkList/List';
import RemarkAll from '../core/components/RemarkList/All';
import RemarkAdd from '../core/components/RemarkList/Add';

import RemarkFileList from '../core/components/RemarkFileList/List';
import RemarkFileAll from '../core/components/RemarkFileList/All';
import RemarkFileAdd from '../core/components/RemarkFileList/Add';

import ExecuteTask from './ExecuteTask';

module.exports = React.createClass({
	getInitialState:function(){

		return {
			hideNoData: true,
			detail:{},
			remarkList:[],       //备注
			fileList:[]			 //附件
		}
	},

	componentWillMount:function(){

	},

	componentDidMount:function(){

	},
	executeTask:function(param){
		this.props.executeTask(param);
	},

	delTask:function(){
		var self = this;
		bootbox.confirm("确认删除吗?", function (result) {
			if (result) {
				AjaxRequest.delete(APIS.task_list+"/"+self.props.detailData.id, null, function(body){
					if(body.code == 200 || body.code == '200'){
						self.props.getData();
					}
				});
			}
		});
	},

	getRemark:function(id){
		var self = this,
			remarkUrl = APIS.remark_text_list.replace('{type}','task').replace('{id}',id);
		AjaxRequest.get(remarkUrl, null, function(body){
			if(body.code == 200 || body.code == '200'){
				self.setState({
					remarkList:body.data
				})
			}
		});
	},
	getFiles:function(id){
		var self = this,
			fileUrl = APIS.remark_files_list.replace('{type}','task').replace('{id}',id);
		AjaxRequest.get(fileUrl, null, function(body){
			if(body.code == 200 || body.code == '200'){
				self.setState({
					fileList:body.data
				});
				if(body.data && body.data.length>0){
					//附件列表图片预览
					$('#dowebokList').viewer({
						url: 'data-original',
						built: function() {
							var ht = $("#dowebokListDiv");
							$("#dowebokListDiv").remove();
							$(document.body).append(ht);
						}
					});
					//全部附件图片预览
					$('#dowebokAll').viewer({
						url: 'data-original',
						built: function() {
							var ht = $("#dowebokAllDiv");
							$("#dowebokAllDiv").remove();
							$(document.body).append(ht);
						}
					});
				}
			}
		});
	},
	//备注
	addRemark:function (val) {
		var self = this;

		if(!val){
			alert('请输入备注内容')
		}
		var param = {
			content: val,
			entityId:this.props.detailData.id,
			remarkType: "task"
		};
		AjaxRequest.post(APIS.notes_add, param, function(body){
			if(body.code == 200 || body.code == '200'){
				alert('新增备注成功!');
				self.getRemark(self.props.detailData.id);
			}
		});
	},

	addFile:function (data) {
		var self = this,
			ids = [];
		for(var i=0,len=data.length;i<len;i++){
			ids.push(data[i].fId);
		}
		ids = ids.join(',');
		var param = {
			"content":"",
			"remarkType":"task",
			"picFileIds":ids,
			"entityId":this.props.detailData.id
		};
		AjaxRequest.post(APIS.notes_add, param, function(body){
			if(body.code == 200 || body.code == '200'){
				alert('上传成功!');
				self.getFiles(self.props.detailData.id);
			}
		});
	},
	clearUpList:function () {
		this.refs.fileAdd.clearList();
	},

	finishedTask:function(id,status,e){
		this.props.finishedTask(id,status,e);
	},
	setNoData: function(bl){
		this.setState({hideNoData: bl});
	},
	render:function(){
		var self = this;
		var statusText = "";
		var status = this.props.detailData.status;
		if(status == 0 || status == '0'){
			statusText = "未开始";
		}else if(status == 1 || status == '1'){
			statusText = "进行中";
		}else if(status == 2 || status == '2'){
			statusText = "已完成";// style={{border:'solid 1px #dedede', borderBottom:'0px'}}backgroundColor:'#f2f2f2',
		}


		var params = self.props.params;
		var rPath = self.props.routes[1].path;
		var taskId = self.props.detailData.id;
		var editUrl = `#/task/edit/${taskId}`;

		if(rPath == 'customer'){
			editUrl = `#/customer/${params.customerId}/task/edit/${taskId}`;
		}else if(rPath == 'chance'){
			editUrl = `#/chance/${params.chanceId}/task/edit/${taskId}`;
		}else if(rPath == 'linkman'){
			editUrl = `#/linkman/${params.linkmanId}/task/edit/${taskId}`;
		}

		return (
			<div style={{minHeight:'640px', border:'solid 1px #dedede', borderTop:'0px', backgroundColor:'#fff', position:'relative'}}>
				<div style={{display: (this.state.hideNoData ? 'block' : 'none')}}>

					<div className="divTitle">
						<div className="checkbox div-checkbox" style={{top: 0+'px'}} onClick={this.finishedTask.bind(this,this.props.detailData.id,status)}>
							<label>
								<input type="checkbox" className="colored-success" checked={this.props.detailData.checked}/>
								<span className="text"></span>
							</label>
						</div>
						<span className={status == 2 ? 'taskTitle line-font':'taskTitle'}>{this.props.detailData.subject?this.props.detailData.subject:"未填写"}</span>
						<span className="taskStatus">{statusText}</span>
					</div>

					<div className="dashboard-box">
						<div className="box-tabbs">
							<div className="tabbable">
								<ul className="nav nav-tabs myTab" id="myTab11" style={{borderLeft:'0px', borderRight:'0px'}}>
									<li className="active">
										<a data-toggle="tab" href="#task-detail">
											任务详情
										</a>
									</li>
									<li>
										<a data-toggle="tab" href="#task-other">
											其他相关
										</a>
									</li>
									<div className="executeBtn">
										<a className="btn btn-danger" data-toggle="modal" data-target="#executeTaskModal">执行</a>
									</div>
									<div className="btn-group editdelBtn" style={{display:this.props.detailData.owner ? 'block' : 'none'}}>
										<a className="btn btn-default dropdown-toggle" data-toggle="dropdown">
											编辑 <i className="fa fa-angle-down"></i>
										</a>
										<ul className="dropdown-menu" style={{marginTop: 5+'px',minWidth: 125+'px'}}>
											<li>
												<a href={editUrl}>
													编辑
												</a>
											</li>
											<li>
												<a href="javascript:void(0);" onClick={this.delTask}>删除</a>
											</li>
										</ul>
									</div>
								</ul>
								<div className="tab-content tabs-flat detail-left no-border">
									<div id="task-detail" className="animated fadeInUp tab-pane in active">
										<DetailInfo lists={this.props.detailList}/>
									</div>
									<div id="task-other" className="tab-pane animated fadeInUp">
										<div className="row">
											<div className="col-lg-12">
												<ExecuteList lists={this.props.executeList}/>
												<hr className="wide"/>
												<RemarkList lists={this.state.remarkList}/>
												<hr className="wide"/>
												<RemarkFileList lists={this.state.fileList} clearUpList={this.clearUpList}/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '31%', marginTop:'-2px', left:'50%', marginLeft:'-15px', position:'absolute'}}><div className='crmNoData'>暂无数据</div></div>

				<div className="container-fluid text-center">
					<RemarkAll lists={this.state.remarkList} />
					<RemarkAdd addNotes={this.addRemark} />

					<RemarkFileAll lists={this.state.fileList} />
					<RemarkFileAdd addFile={this.addFile} ref="fileAdd"/>

					<ExecuteTask executeTask={this.executeTask} ref="executeTask" />
				</div>
			</div>
		)
	}
});