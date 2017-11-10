import React from 'react';
import {APIS} from '../../../core/common/config';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
			isShowDelBtn:false,
			isShowMoveBtn:false
		}
	},
	renderComponent: function() {

	},
	componentWillMount:function() {

	},
	componentDidMount:function(){
	},
	componentDidUpdate:function(){
		if(this.props.lists && this.props.lists.length > 0){
			Tools.imgLoadError();
		}
	},
	clickBack:function (id) {
		this.props.clickBack(id);
	},

	delTask:function(id,e){
		e.stopPropagation();
		this.props.delTask(id);
	},

	delBtn:function(){
		this.setState({
			isShowDelBtn:!this.state.isShowDelBtn
		});
	},
	orderBtn:function(){
		this.setState({
			isShowMoveBtn:!this.state.isShowMoveBtn
		});
	},
	showForm:function(type){
		this.props.showForm(type);
	},
	move:function(taskId,type){
		this.props.move(taskId,type);
	},
	updateSortIndex:function(){
		this.orderBtn();
		this.props.updateSortIndex();
	},
	render:function(){
		var lists = this.props.lists;
		var isColsed = this.props.isColsed;
		var size = lists.length;
		var currentId = this.props.currentId;
		if( !Array.isArray(lists) ) throw new Error('this.props.lists必须是数组');

		var isShowMoveBtn = this.state.isShowMoveBtn;

		var num = 1;
		var lis = lists.map(function(qst,key){
			var bgcolor = "#fff";
			if(qst.id == currentId){
				bgcolor = "#f2f5f5";
			}
			var isShowUpBtn = isShowMoveBtn;
			var isShowDownBtn = isShowMoveBtn;
			if(key == 0){
				isShowUpBtn = false;
			}else if(key == (size-1)){
				isShowDownBtn = false;
			}

			return <li style={{cursor:"pointer"}} key={key} style={{backgroundColor:bgcolor}} onClick={this.clickBack.bind(this,qst.id)}>

						<span className="field">
							<div style={{display:isShowMoveBtn ? 'none' : 'block',width: '25px',height: '25px',float: 'left'}}>
								{num++}
							</div>
							<div style={{visibility:isShowUpBtn ? 'visible' : 'hidden',width: '25px',height: '25px',float: 'left'}} onClick={this.move.bind(this,qst.stageTaskId,"up")}>
								<img src={`${APIS.img_path}/assets/img/up.png`} name="defaultPic" width="25" height="25" alt=""/>
							</div>
							<div style={{visibility:isShowDownBtn ? 'visible' : 'hidden',width: '25px',height: '25px',float: 'left'}} onClick={this.move.bind(this,qst.stageTaskId,"down")}>
								<img src={`${APIS.img_path}/assets/img/down.png`} name="defaultPic" width="25" height="25" alt=""/>
							</div>
						</span>
						<span className="field">{qst.taskName}</span>
						<span className="field">{qst.statusText}</span>
						<span className="field">
							{qst.updatedOn?qst.updatedOn:qst.createdOn}

							<a onClick={this.delTask.bind(this,qst.stageTaskId)} className="btn btn-danger btn-sm" style={{display:this.state.isShowDelBtn ? 'block' : 'none',position: 'absolute',right: 20+'px',top: 8+'px'}} href="javascript:void(0);">
								<i className="fa fa-times"></i>删除
							</a>
						</span>

					</li>
		}.bind(this) );

		return (
				<div className="dashboard-box">
					<div className="box-tabbs">
						<div className="tabbable">
							<ul className="nav nav-tabs myTab" id="myTab11">
								<li className="active">
									<a data-toggle="tab" href="#stage-task">
										阶段任务
									</a>
								</li>
								<div className="addBtn" style={isColsed==1 ? {display:'none'} : {}}>
									<a className="btn btn-default" onClick={this.showForm.bind(this,"add")}>新增</a>
								</div>
								<div className="delBtn" style={isColsed==1 ? {display:'none'} : {}}>
									<a className="btn btn-default" style={{display:this.state.isShowDelBtn? 'none' : 'block'}} onClick={this.delBtn}>删除</a>
									<a className="btn btn-default" style={{display:this.state.isShowDelBtn? 'block' : 'none'}} onClick={this.delBtn}>取消</a>
								</div>
								<div className="orderBtn" style={isColsed==1 ? {display:'none'} : {}}>
									<a className="btn btn-default" style={{display:this.state.isShowMoveBtn? 'none' : 'block'}} onClick={this.orderBtn}>排序</a>
									<a className="btn btn-default" style={{display:this.state.isShowMoveBtn? 'block' : 'none'}} onClick={this.updateSortIndex}>确定</a>
								</div>
								{/*<div className="addBtn">
									<a className="btn btn-default" onClick={this.showForm.bind(this,"add")}>新增</a>
								</div>
								<div className="delBtn">
									<a className="btn btn-default" style={{display:this.state.isShowDelBtn? 'none' : 'block'}} onClick={this.delBtn}>删除</a>
									<a className="btn btn-default" style={{display:this.state.isShowDelBtn? 'block' : 'none'}} onClick={this.delBtn}>取消</a>
								</div>
								<div className="orderBtn">
									<a className="btn btn-default" style={{display:this.state.isShowMoveBtn? 'none' : 'block'}} onClick={this.orderBtn}>排序</a>
									<a className="btn btn-default" style={{display:this.state.isShowMoveBtn? 'block' : 'none'}} onClick={this.updateSortIndex}>确定</a>
								</div>*/}
							</ul>
							<div className="tab-content tabs-flat detail-left">
								<div id="stage-task" className="animated fadeInUp tab-pane in active">
									<ul className="stage-task">
										<li>
											<span className="field">序号</span>
											<span className="field">任务名</span>
											<span className="field">状态</span>
											<span className="field">最后跟进时间</span>
										</li>
										{lis}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
		)
	}
});