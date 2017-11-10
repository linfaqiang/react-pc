import React, { Component } from 'react';
import request from 'superagent';
import {APIS} from '../core/common/config';
import {Link} from 'react-router';
import AjaxRequest from '../core/common/ajaxRequest.js';
import NoteList from '../core/components/NoteList/List';
import NoteAll from '../core/components/NoteList/All';
import NoteAdd from '../core/components/NoteList/Add';
import FileList from '../core/components/FileList/List';
import FileAll from '../core/components/FileList/All';
import FileAdd from '../core/components/FileList/Add';
module.exports = React.createClass({

	getInitialState:function(){
		return {
			param : {
				summary: "",
				plan: "",
				startTime: "",
				endTime: "",
				status: 1,
				acceptorIds: ""
			},
			hideNoData: true
		}
	},
	componentWillMount:function(){

	},
	componentDidUpdate:function(){
		playAudio();
	},
	componentDidMount:function(){

	},
	clearUpList:function () {
		var self=this;
		self.refs.fileAdd.clearList();
	},
	//添加备注
	addNotes:function (val) {
		var self = this;

		if(!val){
			alert('请输入备注内容')
		}
		request
			.post(APIS.notes_add)
			.send({
				content: val,
				entityId:self.props.detailData.id,
				remarkType: "activity"
			})
			.set('Content-Type', 'application/json;charset=utf-8')
			.end(function(err,res){
				if (res.ok) {
					if (res.body.code == '200') {
						alert('新增备注成功!');
						self.props.refreshNote();
					}
				} else {
					console.log('新增备注失败!')
				}
			});
	},
	//附件上传
	addFile:function (data) {
		var self = this,
			ids = [];
		for(var i=0,len=data.length;i<len;i++){
			ids.push(data[i].fId);
		}
		ids = ids.join(',');
		request
			.post(APIS.notes_add)
			.send({
				"content":"",
				"remarkType":"activity",
				"picFileIds":ids,
				"entityId":self.props.detailData.id
			})
			.set('Content-Type', 'application/json;charset=utf-8')
			.end(function(err,res){
				if (res.ok) {
					if (res.body.code == '200') {
						alert('上传成功!');
						self.props.refreshNote();
						self.props.getFiles();
					}
				} else {
					console.log('上传失败!')
				}
			});
	},
	getTracks:function () {
		var self=this;
		self.props.getTracks()
	},
	activityDelet: function () {
		var self=this;
		var id=self.props.detailData.id;
		AjaxRequest.delete(APIS.activity_add+"/"+id, null, function(body) {
			if(body.code=='200' && body.msg=='OK'){
				alert("活动删除成功!");
				self.getTracks();
			}else {
				alert("活动删除失败!");
			}
		});
	},
	setNoData: function(bl){
		this.setState({hideNoData: bl});
	},
	render:function(){
		var lists=this.props.detailData;

		function renderSubject(data){
			if(data.subject){
				return <span style={{fontSize: '16px'}}>{data.subject}</span>;
			}else if(data.audioSubjectFileUrl){
				return (
					<div className="audioBox">
						<audio src={data.audioSubjectFileUrl.replace('.amr', '.mp3')}>你的浏览器不支持audio</audio>
						<p className="audioInfo"><span className="currentTime"></span><span className="duration"></span></p>
					</div>
				);
			}else{
				return <span style={{fontSize: '16px'}}>活动主题未填写</span>;
			}
		}

		return (
			<div style={{ border:'solid 1px #dedede', backgroundColor:'#fff', minHeight:'425px', position:'relative'}}>
				<div className="workRight" style={{display: (this.state.hideNoData ? 'block' : 'none')}}>
					<div className="workRightOne">
						<p>{renderSubject(lists)}</p>
						{/*<div className="work-btn-group" style={lists.isSelf==1 ? {display:'block'} : {display:'none'}}>
							<a className="workRightOne_a" data-toggle="dropdown" href="javascript:void(0);"><i className="fa fa-angle-down"></i></a>
							<ul className="dropdown-menu dropdown-inverse workEdit-menu">
								<li>
									<Link to={'/activity/add/'+this.props.detailData.id}>
										编辑
									</Link>
								</li>
								<li><a href="javascript:void(0);" onClick={this.activityDelet}>删除</a></li>
								<li className="divider"></li>
							</ul>
						</div>*/}
					</div>
					<div className="dashboard-box" style={{marginTop:'-1px'}}>
						<div className="box-tabbs">
							<div className="tabbable">
								<ul className="nav nav-tabs myTab" style={{borderLeft:'0px', borderRight:'0px'}}>

									<li className="active">
										<a data-toggle="tab" href="#customer-khxq">
											活动详情
										</a>
									</li>
									<li>
										<a data-toggle="tab" href="#customer-qtxg">
											其他相关
										</a>
									</li>
									<div className="btn-group editdelBtn"
											  style={{display: (lists.isSelf ? 'block' : 'none'), right:'10px'}}>
										<a className="btn btn-default dropdown-toggle" data-toggle="dropdown">
											编辑 <i className="fa fa-angle-down"></i>
										</a>
										<ul className="dropdown-menu" style={{marginTop: 5+'px',minWidth: '65px'}}>
											<li>
												<Link to={'/activity/edit/'+this.props.detailData.id}>
													编辑
												</Link>
											</li>
											<li>
												<a href="javascript:void(0);" onClick={this.activityDelet}>删除</a>
											</li>
										</ul>
									</div>
								</ul>
								<div className="tab-content tabs-flat detail-left no-border" style={{float:'left',width:'100%'}}>
									<div id="customer-khxq" className="animated fadeInUp tab-pane in active" style={{float:'left'}}>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>活动类型</h5>
												<p>{lists.activityTypeName || '----'}</p>
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>客户名称</h5>
												<p>{lists.customerName || '----'}</p>
											</div>
										</div>
										<div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 detail-tab1-list" style={{display: CONFIG.Exclude && CONFIG.Exclude.chance ? 'none' : 'block'}}>
											<div>
												<h5>商机</h5>
												<p>{lists.chanceName || '----'}</p>
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>联系人</h5>
												<p>{lists.linkman || '----'}</p>
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>联系人电话</h5>
												<p>{lists.mobile || '----'}</p>
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>开始时间</h5>
												<p>{lists.startTime || '----'}</p>
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>结束时间</h5>
												<p>{lists.endTime || '----'}</p>
											</div>
										</div>
										<div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>地址</h5>
												<p>{lists.address && lists.address.address ? lists.address.address : '----'}</p>
											</div>
										</div>
										<div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
											<div>
												<h5>活动内容</h5>
												<p>{lists.content || '----'}</p>
											</div>
										</div>

									</div>

									<div id="customer-qtxg" className="animated fadeInUp tab-pane no-border activityTabTwo">
										<NoteList lists={this.props.noteList}/>

										<FileList clearUpList={this.clearUpList} lists={this.props.fileList} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={this.state.hideNoData ? "no-massage hide" : "no-massage"} style={{top: '31%', marginTop:'-2px', left:'50%', marginLeft:'-15px', position:'absolute'}}><div className='crmNoData'>暂无数据</div></div>
				<div className="container-fluid text-center">
					<NoteAll lists={this.props.noteList} />
					<NoteAdd addNotes={this.addNotes} />
					<FileAll lists={this.props.fileList}/>
					<FileAdd addFile={this.addFile} ref="fileAdd"/>

				</div>
			</div>
		)
	}
});