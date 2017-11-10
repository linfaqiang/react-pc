import React, {
	Component
} from 'react'
import {
	render
} from 'react-dom'
import {
	Link
} from 'react-router'
import Reflux from 'reflux'
import ReactMixin from 'react-mixin'

import CurrentPosition from '../../core/components/layout/CurrentPosition'
import List from '../../core/components/TableList/List'
import MainInfo from '../../core/components/DetailList/MainInfo'
//import TrackList from '../../core/components/TrackList/List';
import TrackList from '../../linkman/components/TrackList';

import CONFIG from '../../core/common/config.js'
import Constants from '../../core/common/constants'
import AjaxRequest from '../../core/common/ajaxRequest'
import Alert from '../../core/components/alert.js'

import RemarkFile from '../../remark/file/file'
import Remark from '../../remark/remark'
import ClueLinkman from './linkman'
import AssignHistory from './assign'
import Buttons from './buttons'
import store from './store'

module.exports = React.createClass({

	getInitialState: function() {
		var obj = store.data;
		obj.routeId = this.props.params.id;
		return obj;
	},

	componentWillUnmount: function() {
		$(document).off('clueDetailIdChange');
	},
	componentDidMount: function(param) {
		let self = this;
		// let id = self.state.routeId;
		/*if (id && id > 0) {
		}*/

		$(document).on('clueDetailIdChange', function(e, detailId){
			self.state.routeId = detailId;
			self.getData();
		});
		self.getData();
		//self.refs.breadcrumb.setRoutes(self.props.routes, self.props.params);
	},
	getData: function(){
		this.getDetail();
		this.getHistory();
		this.getClueTrack(this.state.trackData);
		this.getOtherMsg();
	},

	//获取线索分配历史记录
	getHistory: function() {
		let self = this;
		let id = self.state.routeId;
		let url = [CONFIG.APIS.clue, id, 'assign_histories'].join("/");


		AjaxRequest.get(url, null, function(body) {
			store.data.assignHistory = body.data;
			self.setState({
				assignHistory: store.data.assignHistory.reverse()
			});
			self.refs.assignHistory.renderComponent();


			let tab = self.props.location.query.tab;
			if (tab) {
				$(`#myTab a[href="#${tab}"]`).tab('show');
			}
		});

	}, //end 线索历史记录

	//跟进记录列表

	//获取跟进记录列表
	getClueTrack: function(param) {
		let self = this;
		let id = self.state.routeId;
		let url = [CONFIG.APIS.clue, id, 'tracks'].join("/");

		AjaxRequest.get(url+'?pageSize='+param.pageSize+'&pageNo='+param.pageNo, null, function(body) {
			
			if (body.code == 200){
				self.refs.tracksList.setPagerData(body);
				window.scroll(0, 0);
				if(body.data.length > 0){
					self.refs.tracksList.setNoData(true, body.totalSize);
				}else{

					self.refs.tracksList.setNoData(false, 0);
				}
			}
		});

	}, //end 线索联系人

	//获取线索详情
	getDetail: function() {
		let self = this;
		let id = self.state.routeId;
		let url = [CONFIG.APIS.clue, id].join("/");

		AjaxRequest.get(url, null, function(res) {
			var data = res.data;
			/*var data = JSON.parse(Base64.decode(res.data));
			if(!data.id){
				data = JSON.parse(Base64.decode(data));
			}*/
			let info = store.data.info;
			for (let key in info) {
				if (key == "address" || key == "linkman") {
					for (let k in info[key]) {
						info[key][k] = data[key][k];
					}
				} else {
					info[key] = data[key];
				}

			}
			store.data.info = info;

			let mainInfo = [{
				name: "客户",
				value: info.customerName,
				"color": "yellow",
				icon: "customer"
			}, {
				name: "联系人",
				value: info.linkman.name || "(无)",
				"color": "blue",
				icon: "contacts"
			}, {
				name: "联系方式",
				value: info.linkman.mobile || info.linkman.telephone || "(无)",
				"color": "green",
				icon: "phone"
			}, {
				name: "责任人",
				value: info.ownerStaffName || "(无)",
				"color": "red",
				icon: " pcicon pcicon-head"
			}];
			store.data.mainInfo = mainInfo;

			self.setState({
				mainInfo: store.data.mainInfo,
				info: store.data.info
			});

		});


	}, // end 线索详情

	getOtherMsg: function() {
		this.getLinkman();
		this.getRemarkMsg();
		this.getRemarkFile();
	},

	//获取线索联系人
	getLinkman: function() {
		let self = this;
		let id = self.state.routeId;
		let url = [CONFIG.APIS.clue, id, 'linkman'].join("/");

		AjaxRequest.get(url, null, function(body) {
			store.data.linkman = body.data;
			store.data.linkmanLen = body.totalSize;
			self.setState({
				linkman: store.data.linkman,
				linkmanLen: store.data.linkmanLen
			});
		});

	}, //end 线索联系人

	//获取线索备注内容
	getRemarkMsg: function() {
		let self = this;
		let id = self.state.routeId;
		let url = [CONFIG.APIS.notes_add, "clue", id].join("/");

		AjaxRequest.get(url, null, function(body) {
			store.data.remarkMsg = body.data;
			store.data.remarkLen = body.totalSize;
			self.setState({
				remarkMsg: store.data.remarkMsg,
				remarkLen: store.data.remarkLen
			});
		});

	}, //end 线索备注内容

	//获取线索备注附件
	getRemarkFile: function() {
		let self = this;
		let id = self.state.routeId;
		let url = [CONFIG.APIS.notes_add, "fileRemarkList/clue", id].join("/");;

		AjaxRequest.get(url, null, function(body) {

		    //将amr后缀改为mp3
		    for (var i = 0; i < body.data.length; i++) {
		        var fileUrl=body.data[i].fileUrl;
		        var originName=body.data[i].originName;
		        if(fileUrl.length>3 && fileUrl.substring(fileUrl.length-4,fileUrl.length).toLowerCase() =='.amr'){
		            body.data[i].fileUrl=fileUrl.substring(0,fileUrl.length-4)+'.mp3';
		            body.data[i].extension='mp3';
		            body.data[i].originName=originName.substring(0,originName.length-4)+'.mp3';
		        }
		    }

			store.data.remarkFile = body.data;
			store.data.remarkFileLen = body.totalSize;
			self.setState({
				remarkFile: store.data.remarkFile,
				remarkFileLen: store.data.remarkFileLen
			});
			if(body.data && body.data.length > 0){

				//附件列表图片预览
				$('#dowebokList').viewer({
					url: 'data-original',
					built: function() {
						var ht = $("#dowebokListDiv");
						$("#dowebokListDiv").remove();
						$(document.body).append(ht);
					}
				});
			}
		});

	}, //end 线索备注附件

	contextTypes: {
		router: React.PropTypes.object
	},
	/*listen: function() {
		var self = this;
		self.context.router.listen(function(location) {
			var oldId = self.state.routeId;
			var nid = location.pathname.split('/')[2];
			if (location.pathname.match(/clue\//)) {
				if (oldId && nid != oldId) {
					self.state.routeId = nid;
					self.componentDidMount();
				}
			}
		});
	},*/

	renderInfo: function() {
		if (this.state.info.changeId || 0 == 0) {
			return (
				<div className="clueData">
					{/*<p><b>线索来源</b></p>
                    <p>{this.state.info.sourceTxt}</p>
                    <hr />
                    <p><b>客户地址</b></p>
                    <p>{this.state.info.address.address||"(未填写)"}</p>*/}
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
						<div>
							<h5><b>线索来源</b></h5>
							<p>{this.state.info.sourceTxt}</p>
						</div>
						<div>
							<h5><b>客户地址</b></h5>
							<p>{this.state.info.address.address||"(未填写)"}</p>
						</div>
					</div>
                </div>
			)
		} else {
			return (
				<div className="clueData">
					{/*<p><b>线索来源</b></p>
                    <p>{this.state.info.sourceTxt}</p>
					<hr />
					<p><b>商机</b></p>
					<p><a href={"#/chance/" + this.state.info.chanceId}>{this.state.info.chanceName}</a></p>  
                    <hr />
                    <p><b>客户地址</b></p>
                    <p>{this.state.info.address.address||"(未填写)"}</p>
					*/}
					<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 detail-tab1-list">
						<div>
							<h5><b>线索来源</b></h5>
							<p>{this.state.info.sourceTxt}</p>
						</div>
						<div>
							<h5><b>商机</b></h5>
							<p><a href={"#/chance/" + this.state.info.chanceId}>{this.state.info.chanceName}</a></p>
						</div>
						<div>
							<h5><b>客户地址</b></h5>
							<p>{this.state.info.address.address||"(未填写)"}</p>
						</div>
					</div>
                </div>
			)
		}

	},
	render: function() {
		var style49 = {
			paddingBottom: 49 + "px"
		}
		var styleNone = {
			display: "none"
		}
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body noTopPadding">
					<Buttons info={this.state.info}></Buttons>
		            <div className="row otherRow">
			            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			              	<MainInfo lists={this.state.mainInfo} />
			            </div>
		            </div>

		            <div className="row">
		              	<div className="col-lg-9 col-md-9 col-sm-12 col-xs-12">
		                	<div className="row">
		                  		<div className="col-xs-12">
		                   			 <div className="dashboard-box">
		                      			<div className="box-tabbs">
		                        			<div className="tabbable">
		                          				<ul className="nav nav-tabs myTab" id="myTab">
						                            <li className="active">
						                              <a data-toggle="tab" href="#detail">线索详情</a>
						                            </li>
						                            <li>
						                              <a data-toggle="tab" href="#moreInfo">其他相关</a>
						                            </li>
						                          </ul>
						                          <div className="tab-content tabs-flat no-padding">
						                            <div id="detail" className="tab-pane animated fadeInUp active" style={style49}>
						                              	<div className="row">
						                                	<div className="col-lg-12">
																<AssignHistory ref="assignHistory" lists={this.state.assignHistory} />
						                                    	<hr />
						                                    	{this.renderInfo()}
						                                	</div>
						                              	</div>
						                            </div>
						                            <div id="moreInfo" className="tab-pane padding-10 animated fadeInUp pdLR20">
														<div className="row">
															<ClueLinkman lists={this.state.linkman} clueId={this.state.routeId} linkmanLen={this.state.linkmanLen}/>
														</div>
														<hr className="wide" />  
														<div className="row">
															<Remark lists={this.state.remarkMsg} type="clue" clueId={this.props.params.id} typeId={this.state.routeId} remarkLen={this.state.remarkLen}/>
														</div>
														<hr className="wide" />  
														<div className="row">
															<RemarkFile lists={this.state.remarkFile}  type="clue" clueId={this.props.params.id} typeId={this.state.routeId} remarkFileLen={this.state.remarkFileLen}/>
														</div>										
						                            </div>
		                          				</div>
		                        			</div>
		                      			</div>
		                    		</div>
		                  		</div>
		                	</div>
		              	</div>

						<div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
							<div className="dashboard-box">
								<div className="tabbable">
								   	<div className="tabs-flat orders-container">
									   	<div className="orders-header">
										   	<h6>
											   	<span>跟进记录</span>
										   	</h6>
									   	</div>
									   
									   	<TrackList ref="tracksList"
										           getData={this.getClueTrack}
												   trackData={this.state.trackData}
									   	/>
								   	</div>
								</div>
							</div>
						</div>
		            </div>
				</div>

				
				<Alert result="succees"></Alert>
				<Alert result="danger"></Alert>
			</div>
		)
	}
});