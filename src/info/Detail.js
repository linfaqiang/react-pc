import React from 'react';
import '../core/components/Select2/select2.css';
import AjaxRequest from '../core/common/ajaxRequest.js';
import CurrentPosition from '../core/components/layout/CurrentPosition';
import {APIS} from '../core/common/config';
import UserInfo from '../core/common/UserInfo.js';
import { Modal, Button } from 'antd';
const confirm = Modal.confirm;

module.exports = React.createClass({
	getInitialState:function(){
		var type = localStorage.getItem('CRM_Info_List_Type');
		var url = type == 'notice' ? APIS.notices : APIS.manage_list;
		return {
			hideEdit: false,
			routeId: this.props.params.id,
			isManger: UserInfo.isManager(),
			tableData: {                       //详情首行表格
				firstList:[],
				lists: []
			},
			detailList: [],                  //详情
			fileList:[],
			url: url,
			type: type
		}
	},
	componentDidMount:function(){
		this.getData();  //详情首行
	},
	goBack: function () {
		history.back();
	},
	setDetailData:function (data) {    //设置详情
		var list = this.state.detailList;

		for(var i=0,len=list.length; i<len; i++){
			var field = this.state.detailList[i].field;
			this.state.detailList[i].value = data[field] || '------'
		}

		this.setState(this.state.detailList)
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
		var thisUrl = self.state.url;

		AjaxRequest.get(thisUrl+"/"+self.state.routeId, null, function(body) {
			var tt = body.data;
			// var tt = JSON.parse(Base64.decode(body.data));
			self.state.tableData.lists = tt;  //设置首页表格数据
			self.setState(self.state.tableData);

			if(tt.isSent && tt.isSent == 1){
				self.setState({hideEdit: true});
			}
		});
	},
	deleteData: function(e){
		e.preventDefault();
		e.stopPropagation();
		var self = this;
		var	thisUrl = self.state.url+'/'+self.state.routeId;
		confirm({
			title: '是否删除',
			content: '数据删将被删除',
			onOk() {
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
		var isManger = self.state.isManger;
		var isNotice = self.props.location.pathname.match('notice') ? true : false;
		var title = this.props.routes[this.props.routes.length -2].name;

		function renderBtns(){
			if(!isManger) return null;
			return (
				<li className="tabBtns btnGroup">
					<a href={isNotice ? (`#/info/notice/${self.state.routeId}/edit`) : (`#/info/news/${self.state.routeId}/edit`)}
					   style={{display: (self.state.hideEdit ? 'none' : 'block')}}>
						<i className="fa fa-edit"></i>
						编辑
					</a>
					<a onClick={self.deleteData}>
						<i className="fa fa-trash-o"></i>
						删除
					</a>
				</li>
			);
		}
		return (
			<div>
				<CurrentPosition routes={this.props.routes} params={this.props.params} />
				<div className="page-body">
					
					<div className="row infoContent">
						<div className="col-xs-12">{/*col-lg-12 col-md-8 col-sm-12 */}
							<div className="dashboard-box">
								<div className="box-tabbs">
									<div className="tabbable">
										<ul className="nav nav-tabs myTab">
											{/*<li onClick={this.goBack}>
												<a className="btnBack"></a>
											</li>*/}
											{/*<li onClick={this.goBack}>
												<i className="glyphicon glyphicon-arrow-left messegeBack" />
											</li>*/}
											<li className="active">
												<a data-toggle="tab" href="#customer-khxq">
													{title}
												</a>
											</li>
											{renderBtns()}
										</ul>
										<div className="tab-content tabs-flat infoDetail">
											<h2>{this.state.tableData.lists.subject}</h2>
											<p>发送时间:<span>{this.state.tableData.lists.createdOn}</span></p>
											<div className="infoContent" dangerouslySetInnerHTML={{__html: this.state.tableData.lists.content}} />
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