import React from 'react';
import {APIS} from '../../common/config';
import {Link} from 'react-router';
import Tools from '../../common/tools.js';

module.exports = React.createClass({

	getInitialState:function(){
		return {
		}
	},
	componentWillMount:function() {
		Tools.imgLoadError();
	},
	componentDidMount:function(){
		$("#taskForm").bootstrapValidator();
	},
	saveTask:function(){
		var bootstrapValidator = $("#taskForm").data('bootstrapValidator');
		bootstrapValidator.validate();
		if (!bootstrapValidator.isValid()) {
			return false;
		}
		var params = {
			id : this.props.action=="edit" ? this.props.detailData.stageTaskId : null,
			taskName:this.refs.taskName.value,
			successRatio:this.refs.successRatio.value,
			remark:this.refs.remark.value
		};
		this.props.saveTask(params);
	},
	executeTask:function(status){
		if(status == -1){
			var st = this.props.detailData.status;
			if(st !=2){
				status = 2;
			}else{
				status = 0;
			}
		};
		this.props.executeTask(status);
	},

	showForm:function(type){
		this.props.showForm(type);
	},
	delTask:function(id){
		this.props.delTask(id);
	},
	contextTypes: {
		router: React.PropTypes.object
	},
	addTask:function(){
		var self = this;
		self.props.addTask(self.props.detailData.taskName);
		/*this.context.router.push({
			pathname: '/task/add/0',
			query: {
				subject: this.props.detailData.taskName,
				type:'stageTask'
			}
		});*/
	},
	render:function(){
		var detail = this.props.detailData;
		var action = this.props.action;
		var isColsed = this.props.isColsed;
		var thisRefs = this.refs;
		for(var attr in thisRefs){
			if(action == "edit"){
				this.refs[attr].value = detail[attr];
			}else{
				this.refs[attr].value = "";
			}

		}
		return (
			<div className="dashboard-box">
				<div className="box-tabbs">
					<div className="tabbable">
						<ul className="nav nav-tabs myTab" id="myTab11">
							<li className="active">
								<a data-toggle="tab" href="#taskInfo">
									{detail.taskName}
								</a>
							</li>
							<div className="checkbox" style={{top:'3px',position: 'absolute',right: (isColsed==1?'120px':'145px')}} >
								<label style={{paddingLeft: '0px'}}>
									<input type="checkbox" className="colored-success" checked={detail.status==2?true:false} onClick={this.executeTask.bind(this,-1)}/>
									<span className="text"></span>
								</label>
							</div>
							<div style={{top:'10px',position: 'absolute',right: '115px', display:(isColsed==1?'none':'block')}} onClick={this.showForm.bind(this,"edit")}>
								<img src={`${APIS.img_path}/assets/img/edit.png`} name="defaultPic" width="26" height="26" alt=""/>
							</div>

							<div className="btn-group orderBtn"  style={{display:this.props.isShow ? 'none' : 'block'}}>
								<a className="btn btn-danger " href="javascript:void(0);">执行</a>
								<a className="btn btn-danger  dropdown-toggle" data-toggle="dropdown" href="javascript:void(0);"><i className="fa fa-angle-down"></i></a>
								<ul className="dropdown-menu dropdown-primary" style={{marginTop:'3px',minWidth:'120px',marginLeft:'-43px'}}>
									<li>
										<a href="javascript:void(0);" onClick={this.executeTask.bind(this,1)}>设为进行中</a>
									</li>
									<li>
										<a href="javascript:void(0);" onClick={this.executeTask.bind(this,2)}>设为已完成</a>
									</li>
									<li>
										<a href="javascript:void(0);" onClick={this.addTask}>添加到销售任务</a>
									</li>
									<li style={{'display':'none'}}>
										<a href="#/task/add/a">添加到日程</a>
									</li>
									<li>
										<a href="javascript:void(0);" onClick={this.delTask.bind(this,detail.stageTaskId)}>删除</a>
									</li>
								</ul>
							</div>
							<div className="executeBtn" style={{display:this.props.isShow ? 'block' : 'none'}}>
								<a className="btn btn-danger" href="javascript:void(0);" onClick={this.saveTask.bind(this,action)}>保存</a>
							</div>
						</ul>
						<div className="tab-content tabs-flat detail-left">
							<div id="taskInfo" className="animated fadeInUp tab-pane in active">
								<div className="row"  style={{display:this.props.isShow ? 'none' : 'block'}}>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detail-tab1-list">
										<div>
											<h5>状态</h5>
											<p>{detail.statusText}</p>
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detail-tab1-list">
										<div>
											<h5>备注</h5>
											<p>{detail.remark?detail.remark:"----------"}</p>
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 detail-tab1-list">
										<div>
											<h5>成功率</h5>
											<p>{detail.successRatio}%</p>
										</div>
									</div>
								</div>
								<div className="row" style={{display:this.props.isShow ? 'block' : 'none'}}>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<div className="widget flat radius-bordered">
											<form id="taskForm" method="post" data-bv-message="This value is not valid"
												  data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
												  data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
												  data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">
													<div id="task-form">
														<div className="form-title">
															{action == "add" ? '创建任务':'编辑任务'}
														</div>
														<div className="row">
															<div className="col-sm-12">
																<div className="form-group">
																	<label htmlFor="taskName">任务名称 <sup>*</sup></label>
																	<div className="input-icon icon-right">
																		<input type="text" name="taskName" className="form-control" id="taskName" ref="taskName" placeholder="请输入任务名称"
																			   data-bv-notempty="true"
																			   data-bv-notempty-message="任务名称必须输入"
																			   data-bv-stringlength="true"
																			   data-bv-stringlength-min="1"
																			   data-bv-stringlength-max="100"
																			   data-bv-stringlength-message="客户名称在1到100个字符之间"/>
																	</div>
																</div>
															</div>
														</div>

														<div className="row">
															<div className="col-sm-12">
																<div className="form-group">
																	<label htmlFor="successRatio">成功率<sup>*</sup></label>
																	<div className="input-icon icon-right">
																		<select name="successRatio" ref="successRatio" data-bv-notempty="true"
																				data-bv-notempty-message="成功率必须选择" id="successRatio" style={{width:'100%'}}>
																			<option value="0">0%</option>
																			<option value="5">5%</option>
																			<option value="10">10%</option>
																			<option value="15">15%</option>
																			<option value="20">20%</option>
																			<option value="25">25%</option>
																			<option value="30">30%</option>
																			<option value="35">35%</option>
																			<option value="40">40%</option>
																			<option value="45">45%</option>
																			<option value="50">50%</option>
																			<option value="55">55%</option>
																			<option value="60">60%</option>
																			<option value="65">65%</option>
																			<option value="70">70%</option>
																			<option value="75">75%</option>
																			<option value="80">80%</option>
																			<option value="85">85%</option>
																			<option value="90">90%</option>
																			<option value="95">95%</option>
																			<option value="100">100%</option>
																		</select>
																	</div>
																</div>
															</div>
														</div>

														<div className="row">
															<div className="col-sm-12">
																<label htmlFor="remark">描述</label>
					                                        <span className="input-icon icon-right">
					                                            <textarea id="remark" name="remark" ref="remark" className="form-control" rows="3"
																		  placeholder="任务描述"
																		  data-bv-stringlength="false"
																		  data-bv-stringlength-min="1"
																		  data-bv-stringlength-max="300"
																		  data-bv-stringlength-message="任务描述在1到300个字符之间"></textarea>
					                                        </span>
															</div>
														</div>

													</div>
											</form>
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